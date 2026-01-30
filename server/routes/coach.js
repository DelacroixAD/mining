/**
 * AI Sustainability Coach
 * POST /api/coach - why harmful, 2–3 changes, before/after % improvement
 */

const express = require('express');
const router = express.Router();
const coach = require('../ai/coach');

router.post('/', (req, res) => {
  const { impact, scenario, oreQuality, processingSpeed, energySource } = req.body;
  if (!impact) return res.status(400).json({ error: 'impact required' });
  const result = coach.getCoachResponse(impact, {
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
  });
  res.json(result);
});

module.exports = router;
