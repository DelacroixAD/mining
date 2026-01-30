# ✅ Complete System Test Guide

## Required Servers (All 3 Must Be Running)

### ✅ 1. Node.js Backend (Port 3001)

**Purpose:** Mining simulator calculations, tradeoffs, timeline, comparisons

```bash
cd D:\Codes\vscode\vibeathon\mining
npm start
```

**Expected output:**

```
Server running at http://localhost:3001
```

**Status:** ✅ Running

---

### ✅ 2. Python ML API (Port 8000)

**Purpose:** Your trained ML model predictions

```bash
cd D:\Codes\vscode\vibeathon
python -m uvicorn app:app --reload
```

**Expected output:**

```
INFO: Uvicorn running on http://127.0.0.1:8000
```

**Status:** Check if running

---

### ✅ 3. React Frontend (Port 5173)

**Purpose:** User interface

```bash
cd D:\Codes\vscode\vibeathon\mining
npm run dev
```

**Expected output:**

```
VITE ready in XXX ms
Local: http://localhost:5173/
```

**Status:** ✅ Running

---

## Testing Checklist

### Step 1: Open Application

Go to: **http://localhost:5173**

✅ Should see landing page with "Start Simulation" button

---

### Step 2: Start Simulation

1. Click **"Start Simulation"**
2. Select a scenario (e.g., "Open-Pit Mining")
3. Click **"Continue"**

✅ Should navigate to Decision Simulator

---

### Step 3: Test Simulator (Main Page)

**What to check:**

✅ **Controls work:**

- Ore quality slider (0-100%)
- Processing speed slider (0-100%)
- Energy source dropdown (Coal, Gas, Grid, Renewable)

✅ **Current Impact displays:**

- CO₂: XXX t
- Water: XXX m³
- Waste: XXX t

✅ **🤖 ML Model Predictions display (purple/blue card):**

- CO₂ Emissions (Mt)
- Water Usage (m³)
- Water Stress Index
- Sustainability Score
- Should say "Powered by trained Random Forest model"

✅ **Environment visual updates** (right side)

✅ **Damage Score shows** (0-100 with color band)

---

### Step 4: Test "Continue to Tradeoff" Button

**IMPORTANT:** This was your issue!

1. Adjust some controls
2. Wait for impact calculations to load
3. Click **"Continue to tradeoff"** button (bottom right)

✅ **Should navigate to /tradeoff page**

**If it doesn't work:**

- Check Node.js server is running (Terminal 1)
- Check browser console (F12) for errors
- Look for "http proxy error" - means Node.js server is down

---

### Step 5: Test Tradeoff Page

Once on tradeoff page:

✅ **Slider works** (Profit ← → Sustainability)

✅ **Impact numbers update** as you move slider

✅ **Environment visual updates**

✅ **"Continue to timeline" button works**

---

### Step 6: Test Full Flow

Complete path:

1. Landing → Scenario Selection → Simulator
2. Simulator → Tradeoff
3. Tradeoff → Timeline
4. Timeline → Comparison
5. Comparison → Summary

✅ All pages should load without errors

---

## Troubleshooting

### ❌ "Continue to tradeoff" not working

**Symptoms:**

- Button doesn't respond
- Button is grayed out
- Page doesn't navigate

**Solutions:**

1. **Check Node.js server is running:**

   ```bash
   cd D:\Codes\vscode\vibeathon\mining
   npm start
   ```

   Should see: `Server running at http://localhost:3001`

2. **Check browser console (F12):**
   - Look for "ECONNREFUSED" errors
   - Look for "API 500" or "API 404" errors

3. **Verify impact data loaded:**
   - Impact card should show CO₂, Water, Waste values
   - If values are missing, Node.js API isn't responding

4. **Refresh the page:**
   - Sometimes React state gets stuck
   - Full page refresh (Ctrl+F5) helps

---

### ❌ ML Predictions not showing

**Symptoms:**

- No purple/blue card
- Shows error message

**Solutions:**

1. **Check Python API is running:**

   ```bash
   cd D:\Codes\vscode\vibeathon
   python -m uvicorn app:app --reload
   ```

2. **Check Python API is accessible:**
   - Open http://127.0.0.1:8000/docs
   - Should see FastAPI documentation

3. **CORS issues:**
   - Check app.py has CORS middleware enabled
   - Should have `allow_origins=["*"]`

---

### ❌ Environment visual not updating

**Symptoms:**

- Gray box or static image
- Visual doesn't respond to controls

**Solutions:**

1. Node.js API must be running
2. Check Network tab (F12) - should see successful `/api/impact` calls
3. Clear browser cache

---

## Quick Health Check

### Test All 3 APIs at once:

**Terminal 1:**

```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"ok","service":"sustainability-simulator"}`

**Terminal 2:**

```bash
curl http://127.0.0.1:8000/docs
```

Should open FastAPI documentation

**Browser:**

```
http://localhost:5173
```

Should show landing page

---

## Expected Behavior Summary

### Working System:

1. **Landing page** → "Start Simulation" works
2. **Scenario selection** → Pick scenario, "Continue" works
3. **Decision Simulator** → All controls work
   - Current Impact shows (Node.js API)
   - ML Predictions show (Python API) 🤖
4. **"Continue to tradeoff"** → Navigates to tradeoff page ✅
5. **Tradeoff page** → Slider works, calculations update
6. **Full flow** → Can complete all pages to Summary

---

## Current Status

✅ Node.js Backend: **RUNNING** on port 3001
✅ React Frontend: **RUNNING** on port 5173
⚠️ Python ML API: **CHECK IF RUNNING** on port 8000

**You should now be able to:**

- Adjust controls in the simulator
- See both impact calculations AND ML predictions
- Click "Continue to tradeoff" successfully ✅
- Complete the full flow through all pages

---

## Pro Tips

1. **Keep all 3 terminals open** - you need all servers running
2. **Check terminal outputs** - errors show up there first
3. **Use browser DevTools** (F12) - Network tab shows API calls
4. **Refresh page** if something feels stuck
5. **Check BOTH APIs respond:**
   - http://localhost:3001/api/health (Node.js)
   - http://127.0.0.1:8000/docs (Python)
