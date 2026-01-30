# Mining & Metallurgy Sustainability Simulator

An **AI-powered decision intelligence tool** that makes hidden environmental costs of mining and metallurgy visible, explainable, and avoidable. Built for hackathon impact: real-time damage score, AI Sustainability Coach, “What if everyone did this?” scaling, scenario save/compare, and a 2-minute Demo Mode for judges.

## Problem statement

Industrial decisions in mining and metallurgy—mining method, energy source, ore grade, processing speed—have long-term environmental impact that is often invisible to decision-makers. CO₂ emissions, water use, waste generation, and ecosystem recovery time are hard to compare and rarely presented in human-scale terms. Without clear cause-and-effect and actionable feedback, operations default to short-term profit over sustainability.

## Why this matters

- **Visibility:** One mine’s choices scale to hundreds or thousands of sites; small changes in energy or grade compound at country or global level.
- **Explainability:** Operators and stakeholders need to know *why* a choice is harmful and *which single change* would reduce damage the most.
- **Emotional impact:** Abstract tonnes and cubic metres become meaningful when expressed as “equivalent to water for X people” or “Y cars off the road for a year.”
- **Decision support:** An AI coach that suggests 2–3 specific changes and shows before/after % improvement turns the simulator into a tool for real improvement.

## Tech stack

- **Backend:** Node.js, Express.js, REST API
- **Frontend:** React 18, Vite, React Router
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Data:** JSON datasets in `/server/data`
- **AI layer:** Dataset interpolation, scoring, coach, explainable “why,” equivalents (no external API required)

## Project structure

```
├── client/
│   ├── src/
│   │   ├── components/     # EnvironmentVisual, AnimatedNumber, DamageScore
│   │   ├── pages/          # Landing, Demo, Scenario, DecisionSimulator, Tradeoff, Timeline, Comparison, Summary
│   │   └── api.js
│   └── vite.config.js
├── server/
│   ├── data/               # Datasets (JSON) + loadData.js
│   ├── ai/                 # AI logic
│   │   ├── impactEngine.js # Impact, tradeoff, timeline, sustainable alternative
│   │   ├── scoring.js      # Composite damage score 0–100, band (green/yellow/red)
│   │   ├── equivalents.js  # Human-scale: people's water, cars off road
│   │   ├── scaleImpact.js  # 100 mines / country / global scaling
│   │   ├── coach.js        # AI Sustainability Coach: why harmful, 2–3 changes, before/after %
│   │   ├── explainableWhy.js # Which input caused most damage, which change helps most
│   │   ├── recommendations.js
│   │   └── explanations.js
│   └── routes/             # impact, tradeoff, timeline, comparison, summary, recommendations, explain,
│                           # coach, score, scale-impact, why, equivalents, demo, scenario
└── package.json            # npm start (server), npm run dev (client)
```

## How AI + data are used

- **Datasets** (`/server/data`): CO₂ by energy source, water by mining method, waste by ore grade, recovery time by damage, timeline accumulation. All impact calculations and scoring use these with interpolation—no hard-coded multipliers.
- **Damage score (0–100):** Composite from CO₂, water, waste, land/water/air damage (and recovery time when available). Color-coded green (low), yellow (moderate), red (high). Updated in real time as sliders change.
- **AI Sustainability Coach:** Explains why the current choice is harmful, suggests 2–3 specific changes, and shows before vs after impact (percent improvement for CO₂, water, waste, damage score).
- **Explainable “Why?”:** Identifies which input (energy, scenario, ore quality, speed) contributes most to damage and which single change would reduce it the most.
- **Scale This Decision:** Projects impact if 100 mines, a country, or global industry adopted the same choices; results in relatable terms (people’s water, cars equivalent).
- **Emotional impact:** Equivalents module converts metrics to “equivalent to water for X people,” “Y cars off the road for a year,” “Z truckloads of waste.”
- **Scenario save & compare:** Save current decision, try an improved one, then compare damage score and impact side-by-side.
- **Demo Mode:** Guided 3-decision flow (“You are the operations head of a mine with 5 years to meet sustainability goals”) with final outcome summary—optimized for a 2-minute live demo.

## How to run locally

From the **project root** (folder containing `server` and `client`):

1. **Install (once):**
   ```bash
   npm run install:all
   ```
   Or: `npm install --prefix server` and `npm install --prefix client`.

2. **Terminal 1 – backend:**
   ```bash
   npm start
   ```
   Backend: **http://localhost:3001**

3. **Terminal 2 – frontend:**
   ```bash
   npm run dev
   ```
   Frontend: **http://localhost:5173** (Vite proxies `/api` to backend).

4. **Use the app:**
   - **Start Simulation** → scenario → Decision Simulator (sliders, damage score, AI Coach, Scale, Why?, save/compare, equivalents).
   - **Demo Mode (2 min)** → guided 3 decisions → outcome summary (for judges).

## API overview

| Method | Route | Purpose |
|--------|--------|--------|
| POST | `/api/impact` | Impact + damage score 0–100 + equivalents |
| POST | `/api/tradeoff` | Adjusted impact + equivalents + score |
| POST | `/api/timeline` | Long-term projection |
| POST | `/api/comparison` | User vs sustainable alternative |
| POST | `/api/summary` | Totals + recovery + equivalents + score |
| POST | `/api/recommendations` | AI suggestions |
| POST | `/api/explain` | Natural-language explanation |
| POST | `/api/coach` | AI Coach: why harmful, suggestions, before/after % |
| POST | `/api/score` | Damage score 0–100 and band |
| POST | `/api/scale-impact` | Scaled impact (100 mines / country / global) |
| POST | `/api/why` | Top cause of damage + best single change |
| POST | `/api/equivalents` | Human-scale equivalents |
| GET | `/api/demo/steps` | Demo mode steps |
| POST | `/api/demo/outcome` | Demo mode final outcome |
| POST | `/api/scenario/save` | Save current scenario |
| POST | `/api/scenario/compare` | Compare saved vs current |
| GET | `/api/health` | Health check |

## Design notes

- **Visual cause-and-effect:** Land, water, air SVG layers and damage score update in real time; no chart-heavy dashboards.
- **Actionable:** Coach and “Why?” give clear, human-readable next steps and percent improvement.
- **Scalable narrative:** “Scale This Decision” shows impact at 100 mines, country, and global level in relatable terms.
- **Demo-friendly:** Demo Mode delivers a complete story in ~2 minutes for judges.

## License

MIT.
