/**
 * Environmental Damage Score (0–100, color band)
 * POST /api/score - composite score from impact
 */

const express = require('express');
const router = express.Router();
const scoring = require('../ai/scoring');

router.post('/', (req, res) => {
  const { impact, recoveryYears } = req.body;
  if (!impact) return res.status(400).json({ error: 'impact required' });
  const result = scoring.getDamageScore(impact, recoveryYears);
  res.json(result);
});

module.exports = router;
