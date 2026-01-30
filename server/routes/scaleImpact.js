/**
 * "Scale This Decision" – 100 mines, country, global
 * POST /api/scale-impact - scaled impact + relatable equivalents
 */

const express = require('express');
const router = express.Router();
const scaleImpact = require('../ai/scaleImpact');

router.post('/', (req, res) => {
  const { impact, scale } = req.body;
  if (!impact) return res.status(400).json({ error: 'impact required' });
  const result = scaleImpact.getScaledImpact(impact, scale || 'mines100');
  res.json(result);
});

module.exports = router;
