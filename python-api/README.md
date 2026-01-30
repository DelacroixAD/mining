# ML Prediction API

This folder contains the Python FastAPI backend for CO2 emissions predictions.

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Train the model (if co2_model.pkl doesn't exist):

```bash
python model.py
```

3. Start the API server:

```bash
python -m uvicorn app:app --reload --port 8000
```

## API Endpoint

**POST** `http://127.0.0.1:8000/predict`

### Request Body:

```json
{
  "year": 2024,
  "commodity": "coal",
  "production_value": 1000,
  "production_unit": "t",
  "parent_type": "surface",
  "country": "Poland"
}
```

### Response:

```json
{
  "predicted_CO2_Mt": 0.045,
  "water_used_m3": 1234.5,
  "water_stress_index": 0.65,
  "sustainability_score": 0.72
}
```

## Files

- `app.py` - FastAPI server with /predict endpoint
- `model.py` - ML model training script
- `model2.py` - Water data processing script
- `co2_model.pkl` - Trained Random Forest model
- `water.json` - Country-level water usage data
- `emissions_high_granularity.csv` - Training data
