# Quick Start Guide

Get the application running in **under 2 minutes**.

---

## 🚀 First Time Setup

### Step 1: Install Dependencies

Open a terminal in the project root and run:

```bash
npm run install:all
```

**This installs:**
- Backend dependencies (~71 packages)
- Frontend dependencies (~141 packages)

**Wait for**: "added X packages" messages (takes ~15-30 seconds)

---

### Step 2: Start Backend Server

In the same terminal (or a new one), run:

```bash
npm start
```

**Expected output:**
```
Server running at http://localhost:3001
```

**If you see "port already in use":**
- Another instance is running (check other terminals)
- Or kill the process:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  ```

**Keep this terminal running** (don't close it)

---

### Step 3: Start Frontend Server

Open a **new terminal** (keep backend running) and run:

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in 803 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running too**

---

### Step 4: Open Application

Open your browser and go to:

```
http://localhost:5173
```

**You should see:**
- Dark industrial-themed landing page
- Headline: "Every industrial decision has a long-term impact"
- Two buttons: "Start Simulation" and "Demo Mode"

---

## ✅ Quick Test

1. Click **"Start Simulation"**
2. Select **"Open-pit mining"** (first card)
3. Click **"Continue"**
4. Move the **ore quality slider** left and right
5. Watch the numbers change in real-time
6. Watch the environment visual update (land color changes)

**If all this works → You're ready!** 🎉

---

## 🐛 Troubleshooting

### Issue: `npm run install:all` fails

**Solution**: Install separately:
```bash
npm install --prefix server
npm install --prefix client
```

### Issue: Backend won't start

**Symptom**: Port 3001 already in use

**Solution**:
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill it (replace PID with actual number from output)
taskkill /PID <PID> /F

# Try starting again
npm start
```

### Issue: Frontend won't start

**Symptom**: Port 5173 already in use

**Solution**: Same as above, but use port 5173

### Issue: Frontend loads but no data

**Check**:
1. Is backend running? (check terminal for "Server running...")
2. Check backend URL: http://localhost:3001/api/health
   - Should return: `{"status":"ok","service":"sustainability-simulator"}`
3. Check browser console (F12) for errors

### Issue: Visuals don't update

**Fixes**:
1. Refresh browser (Ctrl+R or Cmd+R)
2. Check both terminals for errors
3. Verify API calls in browser DevTools (F12 → Network tab)
4. Make sure you selected a scenario first

---

## 📂 Project Structure Quick Reference

```
mining/
├── client/          → React frontend (Vite)
│   └── src/
│       ├── pages/   → 8 screens
│       ├── components/  → Reusable UI
│       └── api.js   → API client
├── server/          → Node.js backend (Express)
│   ├── routes/      → API endpoints
│   ├── ai/          → Impact calculation
│   └── data/        → JSON datasets
└── package.json     → Root scripts
```

---

## 🎯 Usage Paths

### Path 1: Full Simulation (5-10 minutes)

```
Landing → Scenario Selection → Decision Simulator
  → Tradeoff → Timeline → Comparison → Summary
```

**Best for**: Understanding all features

### Path 2: Demo Mode (2 minutes)

```
Landing → Demo Mode → 3 Decisions → Outcome
```

**Best for**: Quick presentations or first-time users

---

## 🔑 Key Features to Try

1. **Real-time Impact** (Decision Simulator):
   - Change ore quality, processing speed, energy source
   - Watch land, water, air visuals update instantly
   - See CO₂, water, waste numbers animate

2. **AI Sustainability Coach**:
   - Click "AI Sustainability Coach" button
   - Get specific suggestions to reduce impact
   - See before/after % improvement

3. **Scale This Decision**:
   - Click "100 mines" or "Country" or "Global"
   - See how your choice scales up
   - Get relatable metrics ("water for X people")

4. **Why? Explainer**:
   - Click "Why?" near damage score
   - Learn which input causes most damage
   - Get single best change to make

5. **Compare**:
   - Click "Save this decision"
   - Adjust sliders to different values
   - Click "Compare with saved"
   - See side-by-side difference

6. **Timeline Projection**:
   - Go to Timeline screen
   - Click "10y", "50y", "100y"
   - Watch impact accumulate over time
   - See estimated recovery years

---

## 📱 Responsive Design

The app works on:
- **Desktop**: Full split-pane layouts
- **Tablet**: Adapted layouts
- **Mobile**: Stacked layouts (portrait & landscape)

**Test responsive:**
1. Open browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select different devices from dropdown
4. Navigate through app

---

## 🎨 Visual Features

### Color-Coded Metrics
- **CO₂**: Red (danger)
- **Water**: Blue (accent)
- **Waste**: Brown (ore color)
- **Sustainable**: Green (success)

### Damage Score Badge
- **Green (0-30)**: Low damage ✅
- **Yellow (31-65)**: Moderate damage ⚠️
- **Red (66-100)**: High damage 🚨

### Animations
- **Page transitions**: Smooth fades (600ms)
- **Number changes**: Scale + fade (350ms)
- **Visuals**: Color morphing (500ms)
- **Hover effects**: Subtle scale (200ms)

---

## 🔗 Useful URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main app |
| Backend | http://localhost:3001 | API server |
| Health check | http://localhost:3001/api/health | Verify backend |
| API example | http://localhost:3001/api/demo/steps | Sample endpoint |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Full project documentation |
| `RUN.md` | Detailed run instructions |
| `PROJECT_OVERVIEW.md` | Complete technical overview |
| `SCREENS_GUIDE.md` | Visual guide to all 8 screens |
| `TESTING_CHECKLIST.md` | Comprehensive test plan |
| `QUICK_START.md` | This file (get started fast) |

---

## 🎓 Learning the Codebase

### Want to understand a specific screen?

1. **Frontend**: Check `client/src/pages/[ScreenName].jsx`
   - Example: Decision Simulator = `DecisionSimulator.jsx`

2. **API call**: Check `client/src/api.js`
   - All API functions defined here

3. **Backend logic**: Check `server/routes/[endpoint].js`
   - Example: Impact calculation = `server/routes/impact.js`

4. **Calculations**: Check `server/ai/impactEngine.js`
   - Core impact calculation logic

5. **Data**: Check `server/data/*.json`
   - CO₂ factors, water usage, waste generation, etc.

### Want to modify something?

**Change colors:**
- Edit `client/tailwind.config.js` (colors.industrial object)

**Change calculations:**
- Edit `server/ai/impactEngine.js`

**Add new API endpoint:**
1. Create `server/routes/myendpoint.js`
2. Add route in `server/index.js`: `app.use('/api/myendpoint', require('./routes/myendpoint'))`
3. Add client function in `client/src/api.js`

**Add new screen:**
1. Create `client/src/pages/MyScreen.jsx`
2. Add route in `client/src/App.jsx`: `<Route path="/myscreen" element={<MyScreen />} />`

---

## 💡 Pro Tips

1. **Hot Module Replacement (HMR)**:
   - Edit any React component
   - Save file
   - Browser updates instantly (no full reload)
   - Keeps your current state

2. **API changes**:
   - Edit backend code
   - Save file
   - Restart backend (Ctrl+C, then `npm start`)
   - Frontend doesn't need restart

3. **CSS changes**:
   - Edit Tailwind classes in components
   - Save file
   - Instant visual update

4. **Debugging**:
   - Backend: Check terminal output (console.log visible)
   - Frontend: Open browser DevTools (F12 → Console)
   - API calls: DevTools → Network tab → filter by "api"

5. **Performance**:
   - All API calls debounced (feel instant, don't flood server)
   - Animations use GPU acceleration (smooth 60 FPS)
   - SVG visuals (vector, scale perfectly, small size)

---

## 🚀 Next Steps

After getting it running:

1. **Explore all 8 screens** (follow SCREENS_GUIDE.md)
2. **Test key features** (use TESTING_CHECKLIST.md)
3. **Read technical details** (see PROJECT_OVERVIEW.md)
4. **Try Demo Mode** (quick 2-minute guided experience)
5. **Experiment with values** (extreme scenarios: 0% ore, 100% speed, Coal energy)

---

## 🎉 Success!

If you see the landing page and can navigate through the simulator, you're done!

**Application is:**
- ✅ Fully functional
- ✅ Production-ready
- ✅ Well-documented
- ✅ Ready for presentation

**Questions?** Check the other documentation files or examine the code (it's well-commented).

---

**Enjoy building awareness about sustainability! 🌍**
