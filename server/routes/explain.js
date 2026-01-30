/**
 * Natural language explanations of impact.
 * POST /api/explain - Human-readable consequences from impact + datasets.
 */

const express = require('express');
const router = express.Router();
const explanations = require('../ai/explanations');

/**
 * POST /api/explain
 * Body: { impact, years? }
 * Returns: { explanation: string, shortExplanation?: string }
 */
router.post('/', (req, res) => {
  const { impact, years = 0 } = req.body;
  if (!impact) {
    return res.status(400).json({ error: 'impact required' });
  }
  const explanation = explanations.getExplanation(impact, years);
  const shortExplanation = explanations.getShortExplanation(impact);
  res.json({ explanation, shortExplanation });
});

module.exports = router;
