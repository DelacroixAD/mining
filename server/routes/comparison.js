/**
 * User's choice vs sustainable alternative (AI engine).
 * POST /api/comparison - Dataset-driven alternative.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');

/**
 * POST /api/comparison
 * Body: { userImpact, scenario?, oreQuality?, processingSpeed?, energySource? }
 * Returns user impact + sustainable alternative
 */
router.post('/', (req, res) => {
  const { userImpact, scenario, oreQuality, processingSpeed, energySource } = req.body;
  if (!userImpact) {
    return res.status(400).json({ error: 'userImpact required' });
  }
  const alternative = impactEngine.getSustainableAlternative(userImpact, {
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
  });
  res.json({
    user: userImpact,
    alternative,
  });
});

module.exports = router;
