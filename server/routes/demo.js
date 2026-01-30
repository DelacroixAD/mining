/**
 * Story / Demo Mode – guided 3-decision flow for judges (2-min demo).
 * GET /api/demo/steps – list of steps; POST /api/demo/outcome – final outcome from choices.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');
const scoring = require('../ai/scoring');
const data = require('../data/loadData');

const DEMO_STEPS = [
  {
    id: 1,
    title: 'You are the operations head of a mine with 5 years to meet sustainability goals.',
    prompt: 'Choose your mining method.',
    choices: [
      { value: 'open-pit', label: 'Open-pit mining', impact: 'high' },
      { value: 'underground', label: 'Underground mining', impact: 'medium' },
      { value: 'smelting', label: 'Smelting & refining', impact: 'high' },
    ],
    param: 'scenario',
  },
  {
    id: 2,
    title: 'Energy source for operations.',
    prompt: 'Select primary energy.',
    choices: [
      { value: 'coal', label: 'Coal', impact: 'high' },
      { value: 'gas', label: 'Natural gas', impact: 'medium' },
      { value: 'grid', label: 'Grid mix', impact: 'medium' },
      { value: 'renewable', label: 'Renewable', impact: 'low' },
    ],
    param: 'energySource',
  },
  {
    id: 3,
    title: 'Balance throughput and impact.',
    prompt: 'Set ore quality (grade) and processing speed.',
    choices: [
      { value: 'high-fast', label: 'High grade, fast (profit focus)', oreQuality: 80, processingSpeed: 90 },
      { value: 'balanced', label: 'Balanced', oreQuality: 50, processingSpeed: 50 },
      { value: 'sustainable', label: 'Higher grade, slower (sustainability focus)', oreQuality: 70, processingSpeed: 35 },
    ],
    param: 'composite',
  },
];

/**
 * GET /api/demo/steps
 */
router.get('/steps', (req, res) => {
  res.json({ steps: DEMO_STEPS });
});

/**
 * POST /api/demo/outcome
 * Body: { scenario, energySource, composite (high-fast|balanced|sustainable) or oreQuality + processingSpeed }
 */
router.post('/outcome', (req, res) => {
  const { scenario, energySource, composite, oreQuality, processingSpeed } = req.body;
  const step3 = DEMO_STEPS[2].choices.find((c) => c.value === composite);
  const ore = step3?.oreQuality ?? oreQuality ?? 50;
  const speed = step3?.processingSpeed ?? processingSpeed ?? 50;
  const impact = impactEngine.computeImpact({
    scenario: scenario || 'open-pit',
    oreQuality: ore,
    processingSpeed: speed,
    energySource: energySource || 'grid',
  });
  const scoreResult = scoring.getDamageScore(impact);
  const recovery = data.getRecoveryYears(
    (impact.landDamage + impact.waterPollution + impact.airPollution) / 3
  );
  res.json({
    impact,
    damageScore: scoreResult.score,
    damageBand: scoreResult.band,
    damageLabel: scoreResult.label,
    recoveryYears: recovery.mid,
    message: scoreResult.band === 'green'
      ? 'You are on track for sustainability goals.'
      : scoreResult.band === 'yellow'
        ? 'Moderate impact. Shifting to renewable energy and higher-grade ore would help.'
        : 'High impact. Consider renewable energy, underground mining, and lower processing speed to meet goals.',
  });
});

module.exports = router;
