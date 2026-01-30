/**
 * AI recommendations: "How can I reduce impact?"
 * POST /api/recommendations - Human-readable suggestions from current choices + datasets.
 */

const express = require('express');
const router = express.Router();
const recommendations = require('../ai/recommendations');

/**
 * POST /api/recommendations
 * Body: { impact, scenario, oreQuality, processingSpeed, energySource }
 * Returns: { suggestions: string[] }
 */
router.post('/', (req, res) => {
  const { impact, scenario, oreQuality, processingSpeed, energySource } = req.body;
  if (!impact) {
    return res.status(400).json({ error: 'impact required' });
  }
  const suggestions = recommendations.getRecommendations(impact, {
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
  });
  res.json({ suggestions });
});

module.exports = router;
