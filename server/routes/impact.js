/**
 * Real-time impact calculation (dataset + AI engine).
 * POST /api/impact - CO₂, water, waste, damage from scenario + controls.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');
const scoring = require('../ai/scoring');
const equivalents = require('../ai/equivalents');

/**
 * POST /api/impact
 * Body: { scenario, oreQuality (0-100), processingSpeed (0-100), energySource }
 * Returns: impact + damageScore0-100 (band, label) + equivalents (waterText, carsText, wasteText)
 */
router.post('/', (req, res) => {
  const { scenario = 'open-pit', oreQuality = 50, processingSpeed = 50, energySource = 'grid' } = req.body;
  const result = impactEngine.computeImpact({
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
  });
  const scoreResult = scoring.getDamageScore(result);
  const equivResult = equivalents.getEquivalents(result);
  res.json({
    ...result,
    damageScore0to100: scoreResult.score,
    damageBand: scoreResult.band,
    damageLabel: scoreResult.label,
    equivalents: equivResult,
  });
});

module.exports = router;
