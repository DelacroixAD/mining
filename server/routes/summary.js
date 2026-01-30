/**
 * Final summary (dataset-driven recovery time).
 * POST /api/summary - Totals and ecosystem recovery from recovery_time dataset.
 */

const express = require('express');
const router = express.Router();
const data = require('../data/loadData');
const equivalents = require('../ai/equivalents');
const scoring = require('../ai/scoring');

/**
 * POST /api/summary
 * Body: { totalImpact, timelineYears? }
 * Returns summary with recovery years + equivalents + damage score
 */
router.post('/', (req, res) => {
  const { totalImpact, timelineYears = 50 } = req.body;
  if (!totalImpact) {
    return res.status(400).json({ error: 'totalImpact required' });
  }
  const damageScore =
    ((totalImpact.landDamage || 0) + (totalImpact.waterPollution || 0) + (totalImpact.airPollution || 0)) / 3;
  const recovery = data.getRecoveryYears(damageScore);
  const recoveryYears = Math.round(recovery.mid * (1 + (timelineYears || 0) / 100));
  const equiv = equivalents.getEquivalents(totalImpact);
  const scoreResult = scoring.getDamageScore(totalImpact, recoveryYears);
  res.json({
    co2Tonnes: totalImpact.co2Tonnes,
    waterCubicMeters: totalImpact.waterCubicMeters,
    wasteTonnes: totalImpact.wasteTonnes,
    recoveryYears,
    equivalents: equiv,
    damageScore0to100: scoreResult.score,
    damageBand: scoreResult.band,
    damageLabel: scoreResult.label,
  });
});

module.exports = router;
