# Running Your Integrated CO₂ Predictor

## Quick Start

### 1. Start Your Python API (FastAPI Backend)

Open a terminal and run:

```bash
cd D:\Codes\vscode\vibeathon
python -m uvicorn app:app --reload
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Keep this terminal running!**

---

### 2. Start the React Frontend

Open a **NEW** terminal and run:

```bash
cd D:\Codes\vscode\vibeathon\mining

# First time only - install dependencies
npm run install:all

# Start the frontend
npm run dev
```

**Expected output:**

```
VITE ready in XXX ms
Local: http://localhost:5173
```

---

### 3. Open the Application

Open your browser and go to:

```
http://localhost:5173
```

You'll see the landing page with three buttons:

- **Start Simulation** - Original mining simulator
- **🌍 CO₂ Predictor** - Your new prediction page!
- **Demo Mode (2 min)** - Quick demo

---

## What Was Integrated

✅ **Your CO₂ Prediction Model**

- Added as `/predict` route in the React app
- Uses your FastAPI backend at `http://127.0.0.1:8000`
- Beautiful React/Tailwind UI matching the mining project theme
- Form with all your features (year, country, commodity, etc.)
- Real-time predictions with animated results

✅ **Seamless Integration**

- Accessible from the main landing page
- Styled to match the existing industrial theme
- Uses Framer Motion animations like the rest of the app

---

## Architecture

```
┌─────────────────────────────────────────┐
│  React Frontend (Port 5173)             │
│  - Landing Page                         │
│  - Mining Simulator (Node.js API)      │
│  - CO₂ Predictor (Your Python API) ✨  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Python FastAPI (Port 8000)             │
│  - POST /predict                        │
│  - Machine Learning Model               │
│  - Water Impact Calculation             │
└─────────────────────────────────────────┘
```

---

## Files Modified/Created

### Created:

- `mining/client/src/pages/CO2Predictor.jsx` - Your prediction page component

### Modified:

- `mining/client/src/App.jsx` - Added `/predict` route
- `mining/client/src/pages/Landing.jsx` - Added button to CO₂ Predictor

---

## Troubleshooting

### Python API not connecting?

Make sure it's running:

```bash
cd D:\Codes\vscode\vibeathon
python -m uvicorn app:app --reload
```

### React app not starting?

Install dependencies first:

```bash
cd D:\Codes\vscode\vibeathon\mining
npm run install:all
```

### Port already in use?

Kill the process:

```bash
# Windows PowerShell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## Next Steps

1. Start both servers (Python API + React frontend)
2. Open http://localhost:5173
3. Click "🌍 CO₂ Predictor"
4. Fill the form and see your ML predictions!

Your complete sustainability platform is now ready! 🎉
