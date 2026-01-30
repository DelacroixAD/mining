# Visual Screens Guide

## Screen-by-Screen Walkthrough

### 🏠 Screen 1: Landing Page (`/`)

**Purpose**: Welcome users and provide entry points

**Layout**:
```
┌─────────────────────────────────────────┐
│        [Subtle grid background]         │
│                                         │
│   Every industrial decision has a       │
│        long-term impact.                │
│                                         │
│   Explore how mining and metallurgy     │
│   choices affect land, water, and air   │
│        —in real time.                   │
│                                         │
│   [Start Simulation]  [Demo Mode]      │
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- Dark industrial background (#0d1117)
- Large headline with accent color
- Two call-to-action buttons
- Smooth fade-in animation

---

### 🎯 Screen 2: Scenario Selection (`/scenario`)

**Purpose**: Choose mining/metallurgy scenario

**Layout**:
```
┌─────────────────────────────────────────┐
│  Choose a scenario                      │
│  Each path has different tradeoffs      │
│                                         │
│  ┌───────┐  ┌───────┐  ┌───────┐      │
│  │  ⛏️   │  │  🕳️   │  │  🔥   │      │
│  │Open-  │  │Under- │  │Smelt- │      │
│  │pit    │  │ground │  │ing &  │      │
│  │mining │  │mining │  │refin- │      │
│  │       │  │       │  │ing    │      │
│  │[desc] │  │[desc] │  │[desc] │      │
│  └───────┘  └───────┘  └───────┘      │
│                                         │
│  ← Back              [Continue →]      │
└─────────────────────────────────────────┘
```

**Key Elements**:
- 3 clickable cards with hover animation
- Icon + title + description per card
- Selected card highlighted with blue border
- Continue button activates when card selected

---

### 🎛️ Screen 3: Decision Simulator (`/simulator`)

**Purpose**: Main interactive control center

**Layout** (Split 50/50):
```
┌─────────────────────────────────────────────────────────┐
│ Left Panel              │  Right Panel                  │
│ ──────────              │  ───────────                  │
│ Adjust decisions        │  Environment (land/water/air) │
│                         │                               │
│ [Damage Score: 36]      │  ┌─────────────────────────┐ │
│    ● Yellow             │  │  [Sky with smoke]       │ │
│                         │  │  [Smoke clouds]         │ │
│ Ore quality: 50%        │  │  [Water body]           │ │
│ ────────o───────        │  │  [Land layers]          │ │
│                         │  └─────────────────────────┘ │
│ Processing speed: 50%   │                               │
│ ────────o───────        │  What this means:             │
│                         │  Current choices generate     │
│ Energy source:          │  moderate impact...           │
│ [Grid mix ▼]            │                               │
│                         │  [AI Coach panel if opened]   │
│ Current impact:         │                               │
│ CO₂: 18 t              │  [Scale impact if selected]   │
│ Water: 287 m³          │                               │
│ Waste: 52 t            │  [Why? explanation if shown]  │
│                         │                               │
│ [AI Sustainability      │  [Compare results if shown]   │
│  Coach]                 │                               │
│                         │                               │
│ Scale this decision:    │                               │
│ [100 mines][Country]    │                               │
│ [Global]                │                               │
│                         │                               │
│ [Save] [Compare]        │                               │
│                         │                               │
│ ← Back    [Continue →] │                               │
└─────────────────────────────────────────────────────────┘
```

**Key Elements**:
- **Left**: All controls + metrics
- **Right**: SVG environment visual + AI panels
- Real-time updates on every change
- Damage score badge at top
- Multiple expandable AI features
- Smooth animations throughout

**Interactions**:
1. Move sliders → visuals update instantly
2. Change energy → CO₂ recalculates
3. Click AI Coach → panel slides open
4. Click Why? → explainer appears
5. Select scale → scaled impact shows
6. Click save → stores current state
7. Click compare → shows saved vs current

---

### ⚖️ Screen 4: Tradeoff (`/tradeoff`)

**Purpose**: Balance profit vs sustainability

**Layout**:
```
┌─────────────────────────────────────────┐
│  Profit vs sustainability               │
│  Move slider to see impact change       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Profit         Sustainability   │   │
│  │ ←──────────o───────────────→    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌───────────┐  ┌──────────────────┐  │
│  │[Environ-  │  │ [Damage Score]   │  │
│  │ ment      │  │                  │  │
│  │ Visual]   │  │ Current impact:  │  │
│  │           │  │ CO₂: 18 t       │  │
│  │           │  │ Water: 287 m³   │  │
│  │           │  │ Waste: 52 t     │  │
│  └───────────┘  └──────────────────┘  │
│                                         │
│  What this means:                       │
│  Prioritizing sustainability reduces... │
│                                         │
│  ← Back              [See timeline →]  │
└─────────────────────────────────────────┘
```

**Key Elements**:
- Large horizontal slider (profit ← → sustainability)
- Environment visual morphs as slider moves
- Numbers update in real-time
- Explanation text below

**Behavior**:
- Slide left (profit): Impact increases
- Slide right (sustainability): Impact decreases
- Visual feedback immediate

---

### 📅 Screen 5: Timeline (`/timeline`)

**Purpose**: Project long-term accumulation

**Layout**:
```
┌─────────────────────────────────────────┐
│  Long-term projection                   │
│  See how impact accumulates over time   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Time: 50 years                  │   │
│  │ [Now] [10y] [50y] [100y]       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌───────────┐  ┌──────────────────┐  │
│  │[Environ-  │  │ Projected impact:│  │
│  │ ment      │  │ CO₂: 890 t      │  │
│  │ Visual    │  │ Water: 14,350 m³│  │
│  │ (worse    │  │ Waste: 2,600 t  │  │
│  │  over     │  │                  │  │
│  │  time)]   │  │ Est. recovery:   │  │
│  │           │  │ 42 years         │  │
│  └───────────┘  └──────────────────┘  │
│                                         │
│  Long-term impact:                      │
│  Over 50 years, accumulated damage...   │
│                                         │
│  ← Back     [Compare with alternative]│
└─────────────────────────────────────────┘
```

**Key Elements**:
- Time selector buttons (Now/10y/50y/100y)
- Environment visual shows worsening over time
- Recovery years estimate
- Accumulated totals multiply with time

**Behavior**:
- Click different time periods
- Watch numbers grow
- See visual degradation increase
- Recovery time extends

---

### 🔀 Screen 6: Comparison (`/comparison`)

**Purpose**: Compare user's choice vs optimized alternative

**Layout**:
```
┌─────────────────────────────────────────┐
│  Your choice vs sustainable alternative │
│  Side-by-side impact comparison         │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Your choice  │  │ Sustainable  │   │
│  │              │  │ alternative  │   │
│  │ [Environ-    │  │ [Environ-    │   │
│  │  ment        │  │  ment        │   │
│  │  Visual      │  │  Visual      │   │
│  │  (damaged)]  │  │  (cleaner)]  │   │
│  │              │  │              │   │
│  │ CO₂: 890 t  │  │ CO₂: 107 t  │   │
│  │ Water:14,350│  │ Water: 2,156 │   │
│  │ Waste: 2,600│  │ Waste: 312   │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ← Back              [See summary →]   │
└─────────────────────────────────────────┘
```

**Key Elements**:
- Two columns: User vs Alternative
- Both show environment visuals
- Both show metrics
- Alternative card has green accent border

**Backend Logic**:
- Alternative uses:
  - Renewable energy
  - Higher ore quality (+20%)
  - Lower processing speed (-20%)

---

### 📊 Screen 7: Summary (`/summary`)

**Purpose**: Final report with all metrics

**Layout**:
```
┌─────────────────────────────────────────┐
│         Simulation summary              │
│    Your choices and their long-term     │
│              impact                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   [Damage Score Badge: 63]      │   │
│  │      ● Yellow - Moderate        │   │
│  │                                 │   │
│  │  Total CO₂ emitted: 890 tonnes │   │
│  │                                 │   │
│  │  Water used/polluted:          │   │
│  │  14,350 m³                     │   │
│  │                                 │   │
│  │  Waste generated: 2,600 tonnes │   │
│  │                                 │   │
│  │  Estimated ecosystem recovery: │   │
│  │  42 years                      │   │
│  │                                 │   │
│  │  Equivalent to water for       │   │
│  │  12,250 people for a year.     │   │
│  │  Equivalent to 47 cars off     │   │
│  │  the road for a year.          │   │
│  └─────────────────────────────────┘   │
│                                         │
│      [Restart simulation]               │
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- Centered layout
- Large damage score badge
- All final metrics
- Human-scale equivalents
- Recovery time estimate
- Restart button (resets state, goes to landing)

---

### 🎬 Screen 8: Demo Mode (`/demo`)

**Purpose**: Guided 2-minute story for presentations

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back        Demo Mode (2 min)        │
│                                         │
│  Decision 1: Choose mining method       │
│  You are the operations head of a mine  │
│  with 5 years to meet sustainability    │
│  goals. Which method do you choose?     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ⛏️ Open-pit mining             │   │
│  │ Impact: High land disruption    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🕳️ Underground mining          │   │
│  │ Impact: Groundwater risk        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔥 Smelting & refining         │   │
│  │ Impact: High emissions          │   │
│  └─────────────────────────────────┘   │
│                                         │
│            [← Previous] [Next →]        │
│                                         │
└─────────────────────────────────────────┘
```

**Flow**:
1. **Step 1**: Choose scenario
2. **Step 2**: Choose energy source
3. **Step 3**: Choose priority (profit/balanced/sustainability)
4. **Outcome**: Final summary with storyline

**Key Elements**:
- Narrative context ("You are the operations head...")
- 3 decisions (not full controls)
- Final outcome with story-based feedback
- Optimized for quick presentations

---

## Color Reference

### Damage Score Colors
- **Green (0-30)**: ● Low damage, sustainable ✅
- **Yellow (31-65)**: ● Moderate damage, improvable ⚠️
- **Red (66-100)**: ● High damage, urgent action 🚨

### Metric Colors
- **CO₂**: Red (`#f85149`)
- **Water**: Blue (`#58a6ff`)
- **Waste**: Brown (`#6e4c2e`)
- **Recovery/Sustainable**: Green (`#3fb950`)

### Background Colors
- **Page**: Dark (`#0d1117`)
- **Panels**: Lighter dark (`#161b22`)
- **Borders**: Subtle (`#30363d`)
- **Text**: Light gray (`#e6edf3`)
- **Muted text**: Medium gray (`#8b949e`)

---

## Animation Types

### Page Transitions (Framer Motion)
```javascript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.6 }}
```

### Number Animations
- Scale from 1.15 → 1.0
- Fade from 0.8 → 1.0
- Duration: 350ms

### Environment Visual
- Color interpolation: 500ms
- Smooth bezier easing
- No jarring transitions

### Slider Interactions
- Immediate visual feedback (no delay)
- API calls debounced (but feel instant)

---

## Responsive Behavior

### Desktop (>1024px)
- Split-pane layouts (50/50)
- Controls on left, visuals on right
- Full-width sliders
- Side-by-side comparisons

### Mobile (<1024px)
- Stacked layouts (full width)
- Controls above visuals
- Full-width cards
- Comparison cards stack vertically

---

## User Journey Map

```
Landing → Scenario Selection → Decision Simulator
                                      ↓
                                   Tradeoff
                                      ↓
                                   Timeline
                                      ↓
                                  Comparison
                                      ↓
                                   Summary
                                      ↓
                                   [Restart] → Landing
```

**Alternative Path**:
```
Landing → Demo Mode (3 decisions) → Demo Outcome → [Try Simulator]
```

---

## Key Screen States

### Loading States
- "Calculating…" text centered
- Shown during API calls (50-200ms)
- Smooth fade-in when data arrives

### Empty States
- "Start from simulator" link
- Redirect if missing required data
- User-friendly messages

### Error States
- Graceful fallbacks (show default values)
- Console errors logged (not shown to user)
- Continue button always works

### Interactive States
- **Hover**: Border brightness increases
- **Active**: Border turns accent blue
- **Disabled**: Opacity 50%, cursor not-allowed
- **Selected**: Blue border, blue background tint

---

## Accessibility Features

- **Keyboard navigation**: Tab through all controls
- **Focus indicators**: Blue outline on focus
- **Semantic HTML**: Proper heading hierarchy
- **Color contrast**: WCAG AA compliant
- **Labels**: All inputs properly labeled
- **Screen reader friendly**: ARIA labels where needed

---

## Performance Tips

### Optimization Techniques Used

1. **Debouncing**: Slider changes debounced (but feel instant)
2. **Memoization**: `useCallback` prevents unnecessary re-renders
3. **Lazy loading**: Components load on-demand
4. **Code splitting**: Automatic with Vite
5. **Image optimization**: SVG (scalable, small)
6. **Bundle size**: ~250KB total (gzipped)

### Typical Load Times

- **Initial page load**: <1s
- **API response**: 50-200ms
- **Visual update**: <16ms (60 FPS)
- **Page transition**: 600ms (animated)

---

**This guide covers all 8 screens of the application. Each screen is fully implemented and functional.**
