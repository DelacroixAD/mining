# Testing Checklist

## Quick Verification (5 minutes)

Use this checklist to verify all features are working correctly.

---

## ✅ Pre-Flight Check

- [ ] Backend server running on http://localhost:3001
- [ ] Frontend server running on http://localhost:5173
- [ ] No console errors in terminal
- [ ] Browser can access http://localhost:5173

**Quick Test:**
```bash
# Test backend health endpoint
curl http://localhost:3001/api/health
# Should return: {"status":"ok","service":"sustainability-simulator"}
```

---

## 🏠 Screen 1: Landing Page

**URL**: http://localhost:5173/

- [ ] Page loads with dark industrial theme
- [ ] Headline visible: "Every industrial decision has a long-term impact"
- [ ] Subtitle visible
- [ ] Two buttons present:
  - [ ] "Start Simulation" button (blue)
  - [ ] "Demo Mode (2 min)" button (green border)
- [ ] Smooth fade-in animation
- [ ] Subtle grid background visible

**Test Interactions:**
- [ ] Click "Start Simulation" → navigates to `/scenario`
- [ ] Click "Demo Mode" → navigates to `/demo`

---

## 🎯 Screen 2: Scenario Selection

**URL**: http://localhost:5173/scenario

- [ ] Title: "Choose a scenario"
- [ ] Three cards displayed:
  - [ ] ⛏️ Open-pit mining
  - [ ] 🕳️ Underground mining
  - [ ] 🔥 Smelting & refining
- [ ] Each card has icon, title, description
- [ ] Cards have hover animation (scale up slightly)

**Test Interactions:**
- [ ] Click first card → border turns blue
- [ ] Click different card → selection changes
- [ ] "Continue" button disabled until selection made
- [ ] Click "Continue" with selection → navigates to `/simulator`
- [ ] Click "← Back" → returns to landing page

---

## 🎛️ Screen 3: Decision Simulator (Main Screen)

**URL**: http://localhost:5173/simulator (requires scenario selected)

### Left Panel Tests

- [ ] Title: "Adjust decisions"
- [ ] Damage score badge visible at top
- [ ] Three controls present:
  - [ ] Ore quality slider (0-100%)
  - [ ] Processing speed slider (0-100%)
  - [ ] Energy source dropdown (Coal, Gas, Grid, Renewable)

**Test Real-Time Updates:**
1. [ ] Move ore quality slider → numbers update within 200ms
2. [ ] Move processing speed slider → visual changes
3. [ ] Change energy dropdown to "Coal" → CO₂ increases significantly
4. [ ] Change energy to "Renewable" → CO₂ drops dramatically
5. [ ] All changes reflected in:
   - [ ] CO₂ tonnes number
   - [ ] Water m³ number
   - [ ] Waste tonnes number
   - [ ] Damage score badge color/number
   - [ ] Environment visual (right panel)

**Test Current Impact Display:**
- [ ] Shows three metrics with animated numbers:
  - [ ] CO₂ (red text)
  - [ ] Water (blue text)
  - [ ] Waste (brown text)
- [ ] Numbers animate smoothly when changed
- [ ] Equivalents text appears below (e.g., "Equivalent to water for X people")

**Test AI Features:**

1. **AI Sustainability Coach**
   - [ ] Button visible: "AI Sustainability Coach"
   - [ ] Click button → panel opens on right side
   - [ ] Panel shows:
     - [ ] "Why this choice is harmful" explanation
     - [ ] 2-3 specific suggestions
     - [ ] Before/after % improvement
   - [ ] Close button works

2. **Scale This Decision**
   - [ ] Three buttons visible: "100 mines", "Country", "Global"
   - [ ] Click "100 mines" → scaled impact appears on right
   - [ ] Shows summary like "If 100 mines did this: ..."
   - [ ] Click same button again → hides result

3. **Why? Feature**
   - [ ] "Why?" link visible near damage score
   - [ ] Click "Why?" → panel appears on right
   - [ ] Shows:
     - [ ] "Biggest driver of damage: [input]"
     - [ ] "Best single change: [suggestion]"
   - [ ] Close button works

4. **Save & Compare**
   - [ ] "Save this decision" button visible
   - [ ] Click "Save" → button text changes to "Saved"
   - [ ] "Compare with saved" button visible
   - [ ] Change some sliders to different values
   - [ ] Click "Compare" → shows saved vs current side-by-side
   - [ ] Two small damage score badges appear showing difference

### Right Panel Tests

**Environment Visual:**
- [ ] SVG visualization visible with three layers:
  - [ ] Sky/air layer (gray smoke overlay)
  - [ ] Water layer (blue wavy path)
  - [ ] Land layer (brown terrain)
- [ ] Colors change smoothly when sliders moved:
  - [ ] Land darkens as damage increases
  - [ ] Water becomes murky as pollution increases
  - [ ] Smoke density increases with air pollution
- [ ] No jerky transitions (smooth 500ms animation)

**Explanation Text:**
- [ ] "What this means" section appears below visual
- [ ] Text updates when impact changes
- [ ] Natural language description of current choices

**Navigation:**
- [ ] "← Back" button returns to scenario selection
- [ ] "Continue to tradeoff" button navigates to `/tradeoff`

---

## ⚖️ Screen 4: Tradeoff

**URL**: http://localhost:5173/tradeoff

- [ ] Title: "Profit vs sustainability"
- [ ] Large horizontal slider visible
- [ ] Left label: "Profit" (red)
- [ ] Right label: "Sustainability" (green)
- [ ] Slider starts at middle (50%)

**Test Tradeoff Slider:**
1. [ ] Move slider left (profit) → impact increases
2. [ ] Move slider right (sustainability) → impact decreases
3. [ ] Environment visual updates in real-time
4. [ ] Numbers (CO₂, water, waste) update smoothly
5. [ ] Damage score updates
6. [ ] Explanation text updates

**Visual Check:**
- [ ] Two-column layout on desktop
- [ ] Environment visual on left
- [ ] Metrics panel on right with damage score
- [ ] Stacks vertically on mobile

**Navigation:**
- [ ] "← Back" returns to simulator
- [ ] "See timeline" navigates to `/timeline`

---

## 📅 Screen 5: Timeline

**URL**: http://localhost:5173/timeline

- [ ] Title: "Long-term projection"
- [ ] Four time buttons visible:
  - [ ] Now
  - [ ] 10y
  - [ ] 50y
  - [ ] 100y
- [ ] One button active (blue background)

**Test Timeline Projection:**
1. [ ] Click "Now" → shows current impact
2. [ ] Click "10y" → numbers increase (10x accumulation)
3. [ ] Click "50y" → numbers much higher
4. [ ] Click "100y" → numbers highest
5. [ ] Environment visual worsens with longer timeframes
6. [ ] "Est. recovery: X years" appears below metrics
7. [ ] Recovery years increase with longer timeframes

**Visual Check:**
- [ ] Two-column layout
- [ ] Environment visual on left (progressively worse)
- [ ] Metrics on right
- [ ] Explanation text updates per timeframe

**Navigation:**
- [ ] "← Back" returns to tradeoff
- [ ] "Compare with alternative" navigates to `/comparison`

---

## 🔀 Screen 6: Comparison

**URL**: http://localhost:5173/comparison

- [ ] Title: "Your choice vs sustainable alternative"
- [ ] Two columns visible:
  - [ ] Left: "Your choice"
  - [ ] Right: "Sustainable alternative" (green border)

**Visual Check:**
1. **Your Choice Column:**
   - [ ] Environment visual shows actual damage
   - [ ] Metrics display your numbers
   - [ ] CO₂, Water, Waste all visible

2. **Sustainable Alternative Column:**
   - [ ] Environment visual cleaner/greener
   - [ ] Metrics significantly lower
   - [ ] Uses renewable energy, better ore quality

**Comparison Check:**
- [ ] Alternative CO₂ is much lower (uses renewable)
- [ ] Alternative water usage is lower
- [ ] Alternative waste is lower
- [ ] Visual difference clear between columns

**Navigation:**
- [ ] "← Back" returns to timeline
- [ ] "See summary" navigates to `/summary`

---

## 📊 Screen 7: Summary

**URL**: http://localhost:5173/summary

- [ ] Title: "Simulation summary"
- [ ] Centered layout
- [ ] Large panel with all metrics

**Summary Content Check:**
- [ ] Damage score badge at top (large size)
- [ ] Color-coded (green/yellow/red)
- [ ] "Total CO₂ emitted: X tonnes" (red text)
- [ ] "Water used/polluted: X m³" (blue text)
- [ ] "Waste generated: X tonnes" (brown text)
- [ ] "Estimated ecosystem recovery: X years" (green text)

**Human-Scale Equivalents:**
- [ ] "Equivalent to water for X people for a year"
- [ ] "Equivalent to Y cars off the road for a year"
- [ ] Both sentences displayed if data available

**Navigation:**
- [ ] "Restart simulation" button visible
- [ ] Click restart → resets all state
- [ ] Navigates back to landing page (`/`)
- [ ] Verify state cleared: go through flow again, starts fresh

---

## 🎬 Screen 8: Demo Mode

**URL**: http://localhost:5173/demo

- [ ] Title shows current decision (e.g., "Decision 1: Choose mining method")
- [ ] Narrative context visible ("You are the operations head...")
- [ ] Multiple choice cards displayed

**Test Demo Flow:**

1. **Step 1 - Choose Scenario:**
   - [ ] Three scenario options visible
   - [ ] Each shows impact description
   - [ ] Click one → automatically advances to step 2

2. **Step 2 - Choose Energy:**
   - [ ] Energy source options visible
   - [ ] Each shows impact description
   - [ ] Click one → advances to step 3

3. **Step 3 - Choose Priority:**
   - [ ] Options: Profit / Balanced / Sustainability
   - [ ] Each shows impact description
   - [ ] Click one → "Submit" button appears
   - [ ] Click submit → loads outcome

4. **Outcome Screen:**
   - [ ] Shows final impact summary
   - [ ] Narrative feedback based on choices
   - [ ] Damage score displayed
   - [ ] "Try Simulator" button available
   - [ ] Click "Try Simulator" → goes to full simulator

**Navigation:**
- [ ] "← Back" button at top returns to landing
- [ ] Can restart demo at any time

---

## 🌐 Responsive Design Tests

### Desktop (>1024px)
- [ ] Decision Simulator: Split layout (controls left, visual right)
- [ ] Tradeoff: Side-by-side layout
- [ ] Timeline: Side-by-side layout
- [ ] Comparison: Two columns
- [ ] All text readable, no overflow

### Tablet (768px-1024px)
- [ ] Layouts adapt gracefully
- [ ] Sliders remain usable
- [ ] Cards stack if needed
- [ ] No horizontal scrolling

### Mobile (<768px)
- [ ] All screens stack vertically
- [ ] Controls appear above visuals
- [ ] Buttons full-width or centered
- [ ] Text remains readable (no tiny font)
- [ ] Touch targets large enough (44px+)

**Quick Responsive Test:**
1. [ ] Open browser dev tools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Test different screen sizes:
   - [ ] iPhone SE (375px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)
4. [ ] Navigate through all screens
5. [ ] Verify no layout breaks

---

## 🎨 Visual & Animation Tests

### Colors
- [ ] Dark theme throughout (#0d1117 background)
- [ ] Panels lighter (#161b22)
- [ ] Borders subtle (#30363d)
- [ ] Accent blue (#58a6ff) for buttons/highlights
- [ ] CO₂ red (#f85149)
- [ ] Water blue (#58a6ff)
- [ ] Waste brown (#6e4c2e)
- [ ] Sustainable green (#3fb950)

### Animations
- [ ] Page transitions smooth (600ms fade)
- [ ] Numbers animate on change (scale + fade)
- [ ] Environment visual colors morph smoothly (500ms)
- [ ] Cards have hover effect (scale 1.02)
- [ ] Buttons have hover effect (color brighten)
- [ ] No janky or stuttering animations
- [ ] Animations run at 60 FPS (smooth)

### Typography
- [ ] Headings large and bold
- [ ] Body text readable (14-16px)
- [ ] Muted text lighter gray
- [ ] Numbers use tabular-nums (aligned vertically)
- [ ] No text overflow or truncation

---

## 🔌 API Integration Tests

### Test Backend Communication

**Method 1: Browser DevTools**
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Navigate through simulator, change sliders
4. [ ] Verify API calls:
   - [ ] POST `/api/impact` returns 200 OK
   - [ ] Response time < 300ms
   - [ ] Response contains CO₂, water, waste, damageScore
   - [ ] Multiple calls made as sliders change

**Method 2: Direct API Test**
```bash
# Test impact endpoint
curl -X POST http://localhost:3001/api/impact \
  -H "Content-Type: application/json" \
  -d '{"scenario":"open-pit","oreQuality":50,"processingSpeed":50,"energySource":"grid"}'

# Should return JSON with impact data
```

**Expected API Behavior:**
- [ ] `/api/impact` returns full impact object
- [ ] `/api/tradeoff` adjusts impact based on sustainability level
- [ ] `/api/timeline` projects future accumulation
- [ ] `/api/comparison` returns user + alternative
- [ ] `/api/summary` returns totals + recovery
- [ ] `/api/coach` returns suggestions + % improvement
- [ ] `/api/why` returns root cause analysis
- [ ] `/api/scale-impact` returns scaled results
- [ ] `/api/equivalents` returns human-scale text
- [ ] `/api/demo/steps` returns demo flow data
- [ ] All endpoints return within 300ms

---

## 🐛 Error Handling Tests

### Test Graceful Failures

1. **Backend Down:**
   - [ ] Stop backend server
   - [ ] Try changing sliders in simulator
   - [ ] Verify: Console shows error, but app doesn't crash
   - [ ] Restart backend → app recovers

2. **Invalid Data:**
   - [ ] Manually send invalid API request (wrong data types)
   - [ ] Verify: Backend returns error, frontend shows fallback

3. **Missing State:**
   - [ ] Navigate directly to `/simulator` without selecting scenario
   - [ ] Verify: Redirects to `/scenario` page
   - [ ] Navigate to `/summary` without completing flow
   - [ ] Verify: Shows fallback or redirects

4. **Network Slow:**
   - [ ] Throttle network to "Slow 3G" in DevTools
   - [ ] Change sliders
   - [ ] Verify: Loading states appear, data eventually loads

---

## ⚡ Performance Tests

### Load Time
- [ ] Initial page load < 2 seconds (on cable)
- [ ] API calls complete < 300ms
- [ ] Page transitions smooth (no jank)

### Memory
- [ ] Open Chrome Task Manager (Shift+Esc)
- [ ] Navigate through all screens multiple times
- [ ] Verify memory doesn't balloon (< 100MB increase)
- [ ] No memory leaks

### CPU
- [ ] Animations don't cause high CPU (< 50% on modern device)
- [ ] Slider interactions responsive (< 100ms feedback)

### Bundle Size
```bash
# Build and check bundle size
cd client
npm run build
# Check dist/ folder size → should be < 1MB uncompressed
```

---

## 🧪 Edge Cases

### Extreme Values
- [ ] Set ore quality to 0% → see maximum waste
- [ ] Set ore quality to 100% → see minimum waste
- [ ] Set processing speed to 0% → see minimum impact
- [ ] Set processing speed to 100% → see maximum impact
- [ ] Use Coal energy → see highest CO₂
- [ ] Use Renewable energy → see lowest CO₂

### Rapid Changes
- [ ] Rapidly move sliders back and forth
- [ ] Verify: No crashes, updates keep up
- [ ] Verify: No API request flood (debouncing works)

### Navigation Edge Cases
- [ ] Use browser back button throughout flow
- [ ] Verify: State persists correctly
- [ ] Refresh page mid-flow
- [ ] Verify: State may reset (no persistence), app doesn't crash

---

## ✅ Final Checks

### Code Quality
- [ ] No console errors in browser
- [ ] No console errors in backend terminal
- [ ] No linter warnings (if linter configured)
- [ ] Code formatted consistently

### Documentation
- [ ] README.md exists and is clear
- [ ] RUN.md has accurate instructions
- [ ] PROJECT_OVERVIEW.md comprehensive
- [ ] SCREENS_GUIDE.md helpful

### Git
- [ ] .gitignore includes node_modules/
- [ ] No sensitive data in repo (.env files ignored)
- [ ] Commit history clean (or ready for clean commit)

---

## 🎉 Success Criteria

If all checks pass, the application is **production-ready** and meets all requirements:

✅ Full-stack (Node.js Express + React Vite)  
✅ Real-time interactive simulator  
✅ 8 complete screens with full functionality  
✅ SVG visualizations with smooth animations  
✅ Tailwind CSS styling  
✅ Framer Motion animations  
✅ React hooks state management  
✅ REST API communication  
✅ Clean, commented code  
✅ Comprehensive documentation  

---

## 📝 Testing Notes

**Typical Testing Time:**
- Quick smoke test: 5 minutes
- Thorough test: 15-20 minutes
- Full regression: 30 minutes

**Common Issues & Fixes:**
1. **Port in use**: Kill process, restart servers
2. **API not responding**: Check backend is running on 3001
3. **No visuals**: Check console for errors, verify API responses
4. **Slow updates**: Check network throttling disabled

**Tested Browsers:**
- Chrome/Edge (Chromium): ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design works

---

**Happy Testing! 🚀**
