import pandas as pd

# =========================
# 1. LOAD EXCEL
# =========================
file_path = r"D:\Codes\vscode\vibeathon\EU-coal-mine-database-EEB-with-metadata.xlsx"

df = pd.read_excel(
    file_path,
    sheet_name="database format"
)

# Clean column names (IMPORTANT)
df.columns = df.columns.str.strip()

print("Total rows loaded:", len(df))

# =========================
# 2. SELECT ONLY REQUIRED COLUMNS
# =========================
required_cols = [
    "Mining Method",
    "Water abstracted per tonne of mineral mined m3/tonne",
    "Baseline Water stress"
]

df_water = df[required_cols]

# =========================
# 3. DROP ROWS WITH NO WATER DATA
# =========================
df_water = df_water.dropna(
    subset=["Water abstracted per tonne of mineral mined m3/tonne"]
)

print("Rows with valid water data:", len(df_water))

# =========================
# 4. NORMALIZE WATER STRESS (TEXT → NUMBER)
# =========================
def map_water_stress(val):
    if isinstance(val, str):
        if "Low" in val:
            return 0.2
        if "Medium" in val:
            return 0.5
        if "High" in val:
            return 0.8
    return None

df_water["Baseline Water stress"] = df_water["Baseline Water stress"].apply(map_water_stress)

# =========================
# 5. AGGREGATE BY MINING METHOD
# =========================
water_factors = (
    df_water
    .groupby("Mining Method")
    .mean(numeric_only=True)
)

# =========================
# 6. RENAME COLUMNS (CLEAN JSON)
# =========================
water_factors = water_factors.rename(columns={
    "Water abstracted per tonne of mineral mined m3/tonne": "water_used_per_ton_m3",
    "Baseline Water stress": "pollution_index"
})

# =========================
# 7. EXPORT TO JSON
# =========================
water_factors.to_json(
    "water.json",
    orient="index",
    indent=2
)

print("\n✅ water.json created successfully")
print(water_factors)
