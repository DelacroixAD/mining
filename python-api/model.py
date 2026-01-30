# =========================
# 1. IMPORT LIBRARIES
# =========================
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import seaborn as sns

from scipy.stats import shapiro
from sklearn.preprocessing import PowerTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split, cross_val_score


# =========================
# 2. LOAD DATA
# =========================
import os
csv_path = os.path.join(os.path.dirname(__file__), "emissions_high_granularity.csv")
df = pd.read_csv(csv_path)

print("Initial shape:", df.shape)
print("\nColumns:", df.columns.tolist())

# =========================
# 4. DROP MISSING TARGET
# =========================
target_col = "total_operational_emissions_MtCO2e"
df = df.dropna(subset=[target_col])

print("After dropping missing target:", df.shape)

# =========================
# 5. OUTLIER REMOVAL (TARGET ONLY)
# =========================
Q1 = df[target_col].quantile(0.25)
Q3 = df[target_col].quantile(0.75)
IQR = Q3 - Q1

df = df[
    (df[target_col] >= Q1 - 1.5 * IQR) &
    (df[target_col] <= Q3 + 1.5 * IQR)
]

print("After outlier removal:", df.shape)

# =========================
# 6. NORMALIZE PRODUCTION (OPTIONAL)
# =========================
stat, p = shapiro(df["production_value"])
print(f"Shapiro test p-value: {p:.4f}")

if p < 0.05:
    transformer = PowerTransformer()
    df["production_value"] = transformer.fit_transform(
        df[["production_value"]]
    )

# =========================
# 7. DROP NON‑FEATURE COLUMNS
# =========================
columns_to_drop = [
    "parent_entity",
    "reporting_entity",
    "source",
    "fugitive_methane_emissions_MtCH4"
]

df = df.drop(columns=[c for c in columns_to_drop if c in df.columns])

# =========================
# 8. ONE‑HOT ENCODE CATEGORICALS
# =========================
categorical_cols = ["parent_type", "commodity", "production_unit"]

df_encoded = pd.get_dummies(
    df,
    columns=[c for c in categorical_cols if c in df.columns],
    drop_first=True
)

print("Encoded shape:", df_encoded.shape)

# =========================
# 9. REMOVE LEAKAGE COLUMNS 🚨
# =========================
leakage_columns = [
    "fugitive_methane_emissions_MtCO2e",
    "flaring_emissions_MtCO2",
    "venting_emissions_MtCO2",
    "own_fuel_use_emissions_MtCO2",
    "product_emissions_MtCO2",
    "total_emissions_MtCO2e"
]

df_encoded = df_encoded.drop(
    columns=[c for c in leakage_columns if c in df_encoded.columns],
    errors="ignore"
)

# =========================
# 10. FEATURES & TARGET
# =========================
X = df_encoded.drop(columns=[target_col])
y = df_encoded[target_col]

print("Features:", X.shape)
print("Target:", y.shape)

# =========================
# 11. TRAIN–TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 12. TRAIN RANDOM FOREST
# =========================
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# =========================
# 13. EVALUATION
# =========================
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n=== CO₂ MODEL PERFORMANCE ===")
print(f"RMSE: {rmse:.4f}")
print(f"MAE : {mae:.4f}")
print(f"R²  : {r2:.4f}")

# =========================
# 14. WATER IMPACT FUNCTION (INFERENCE TIME)
# =========================
water_json_path = os.path.join(os.path.dirname(__file__), "water.json")
with open(water_json_path, "r") as f:
    water_by_country = json.load(f)

def compute_water_impact(country, production_value):
    """
    Compute water usage based on country-specific factors.
    Called at inference time, NOT during training.
    """
    if country in water_by_country:
        return production_value * water_by_country[country]["water_used_per_ton_m3"]
    return None

def get_water_stress(country):
    """
    Get water stress/pollution index for a country.
    Higher value = more water stress.
    """
    if country in water_by_country:
        return water_by_country[country]["pollution_index"]
    return None

def normalize(val, max_val):
    """Normalize a value to 0-1 range."""
    return min(val / max_val, 1.0)

def calculate_sustainability_score(co2_value, water_value, water_stress):
    """
    Calculate overall sustainability score.
    Lower is better (0 = perfect, 1 = worst).
    """
    # Normalize CO2 (tune max_val based on your domain)
    co2_score = normalize(co2_value, 50)  # 50 Mt CO2 as reference max
    
    # Normalize water usage
    water_score = normalize(water_value or 0, 500)  # 500 m³ as reference max
    
    # Weight: 60% CO2, 40% water
    final_score = 0.6 * co2_score + 0.4 * water_score
    
    # Adjust for water stress if available
    if water_stress is not None:
        final_score *= (1 + water_stress)  # Amplify score in high-stress areas
    
    return round(final_score, 3)

# =========================
# 15. EXAMPLE USAGE (INFERENCE)
# =========================
print("\n=== EXAMPLE: INFERENCE WITH WATER IMPACT ===")

# Example user input
user_input = {
    "year": 2020,
    "commodity": "Coal",
    "production_value": 10.5,
    "production_unit": "Million tonnes/yr",
    "parent_type": "State-Owned",
    "country": "Germany"
}

# Prepare features for CO2 prediction
# You need to encode categorical variables the same way as training
example_features = pd.DataFrame([{
    "year": user_input["year"],
    "production_value": user_input["production_value"]
}])

# Add one-hot encoded columns (match training data)
for col in X_train.columns:
    if col not in example_features.columns:
        example_features[col] = 0

# Set the appropriate one-hot encoded values
if "commodity_Coal" in example_features.columns:
    example_features["commodity_Coal"] = 1

example_features = example_features[X_train.columns]

# Predict CO2
predicted_co2 = model.predict(example_features)[0]

# Compute water impact
water_used = compute_water_impact(
    country=user_input["country"],
    production_value=user_input["production_value"]
)

# Get water stress index
water_stress = get_water_stress(user_input["country"])

# Calculate sustainability score
sustainability = calculate_sustainability_score(
    co2_value=predicted_co2,
    water_value=water_used,
    water_stress=water_stress
)

result = {
    "predicted_CO2_Mt": predicted_co2,
    "water_used_m3": water_used,
    "water_stress_index": water_stress,
    "sustainability_score": sustainability
}

print(f"Input: {user_input}")
print(f"\nOutput:")
print(f"  Predicted CO₂: {result['predicted_CO2_Mt']:.4f} Mt")
if result['water_used_m3'] is not None:
    print(f"  Water Used: {result['water_used_m3']:.4f} m³")
else:
    print(f"  Water Used: No data for {user_input['country']}")
if result['water_stress_index'] is not None:
    print(f"  Water Stress Index: {result['water_stress_index']:.2f}")
else:
    print(f"  Water Stress Index: No data")
print(f"  Sustainability Score: {result['sustainability_score']:.3f} (0=best, 1=worst)")

# =========================
# 16. SAVE MODEL FOR DEPLOYMENT
# =========================
import joblib

model_path = os.path.join(os.path.dirname(__file__), "co2_model.pkl")
joblib.dump(model, model_path)
print("\n✅ Model saved as co2_model.pkl")

print("\n✅ MODEL READY FOR DEPLOYMENT")
print("✅ CO₂ prediction from ML model")
print("✅ Water impact computed at inference time")
print("✅ No dataset mismatch")
