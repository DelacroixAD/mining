from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd

# =========================
# LOAD MODEL + DATA
# =========================
model = joblib.load("co2_model.pkl")

with open("water.json") as f:
    water_by_country = json.load(f)

# =========================
# API SETUP
# =========================
app = FastAPI(title="Sustainability API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    year: int
    commodity: str
    production_value: float
    production_unit: str
    parent_type: str
    country: str

# =========================
# HELPERS
# =========================
def compute_water(country, production):
    if country in water_by_country:
        return production * water_by_country[country]["water_used_per_ton_m3"]
    return None

def get_water_stress(country):
    if country in water_by_country:
        return water_by_country[country]["pollution_index"]
    return None

def normalize(val, max_val):
    return min(val / max_val, 1.0)

def calculate_sustainability_score(co2_value, water_value, water_stress):
    co2_score = normalize(co2_value, 50)
    water_score = normalize(water_value or 0, 500)
    final_score = 0.6 * co2_score + 0.4 * water_score
    if water_stress is not None:
        final_score *= (1 + water_stress)
    return round(min(final_score, 1.0), 3)

# =========================
# API ENDPOINT
# =========================
@app.post("/predict")
def predict(data: UserInput):

    # --- build feature row (same as training) ---
    X = pd.DataFrame([{
        "year": data.year,
        "production_value": data.production_value
    }])

    # add missing one-hot columns
    for col in model.feature_names_in_:
        if col not in X.columns:
            X[col] = 0

    # encode all categorical features
    for prefix, value in {
        "commodity": data.commodity,
        "parent_type": data.parent_type,
        "production_unit": data.production_unit
    }.items():
        col = f"{prefix}_{value}"
        if col in X.columns:
            X[col] = 1

    X = X[model.feature_names_in_]

    # --- predict ---
    co2 = model.predict(X)[0]
    water = compute_water(data.country, data.production_value)
    water_stress = get_water_stress(data.country)
    score = calculate_sustainability_score(co2, water, water_stress)

    return {
        "predicted_CO2_Mt": round(co2, 4),
        "water_used_m3": round(water, 4) if water is not None else None,
        "water_stress_index": water_stress,
        "sustainability_score": score
    }
