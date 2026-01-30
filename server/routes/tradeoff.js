/**
 * Profit vs Sustainability tradeoff (AI engine).
 * POST /api/tradeoff - Adjusted impact from sustainability level.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');
const equivalents = require('../ai/equivalents');
const scoring = require('../ai/scoring');

/**
 * POST /api/tradeoff
 * Body: { scenario, sustainabilityLevel (0-1), baseImpact }
 * Returns adjusted impact + equivalents + damage score 0-100
 */
router.post('/', (req, res) => {
  const { sustainabilityLevel = 0.5, baseImpact } = req.body;
  if (!baseImpact) {
    return res.status(400).json({ error: 'baseImpact required' });
  }
  const result = impactEngine.applyTradeoff(baseImpact, sustainabilityLevel);
  const equiv = equivalents.getEquivalents(result);
  const scoreResult = scoring.getDamageScore(result);
  res.json({
    ...result,
    equivalents: equiv,
    damageScore0to100: scoreResult.score,
    damageBand: scoreResult.band,
    damageLabel: scoreResult.label,
  });
});

module.exports = router;
