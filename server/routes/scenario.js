/**
 * Scenario save & compare – save first decision, try improved, side-by-side replay.
 * POST /api/scenario/save – save current; POST /api/scenario/compare – get saved vs current.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');
const scoring = require('../ai/scoring');

// In-memory store for saved scenario (per session; use body.sessionId or default)
const saved = new Map();

/**
 * POST /api/scenario/save
 * Body: { impact, scenario, oreQuality, processingSpeed, energySource, sessionId? }
 */
router.post('/save', (req, res) => {
  const { impact, scenario, oreQuality, processingSpeed, energySource, sessionId = 'default' } = req.body;
  if (!impact) return res.status(400).json({ error: 'impact required' });
  saved.set(sessionId, {
    impact,
    params: { scenario, oreQuality, processingSpeed, energySource },
    savedAt: Date.now(),
  });
  res.json({ ok: true, message: 'Scenario saved. Try an improved decision to compare.' });
});

/**
 * POST /api/scenario/compare
 * Body: { currentImpact, scenario, oreQuality, processingSpeed, energySource, sessionId? }
 * Returns: { saved, current, savedScore, currentScore, improved } for side-by-side replay.
 */
router.post('/compare', (req, res) => {
  const {
    currentImpact,
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
    sessionId = 'default',
  } = req.body;
  if (!currentImpact) return res.status(400).json({ error: 'currentImpact required' });
  const savedScenario = saved.get(sessionId);
  if (!savedScenario) {
    return res.json({
      saved: null,
      current: currentImpact,
      savedScore: null,
      currentScore: scoring.getDamageScore(currentImpact),
      improved: null,
      message: 'Save a scenario first, then try an improved decision to compare.',
    });
  }
  const savedScore = scoring.getDamageScore(savedScenario.impact);
  const currentScore = scoring.getDamageScore(currentImpact);
  const improved = currentScore.score < savedScore.score;
  const recoverySaved = (savedScenario.impact.landDamage + savedScenario.impact.waterPollution + savedScenario.impact.airPollution) / 3;
  const recoveryCurrent = (currentImpact.landDamage + currentImpact.waterPollution + currentImpact.airPollution) / 3;
  res.json({
    saved: savedScenario.impact,
    savedParams: savedScenario.params,
    current: currentImpact,
    currentParams: { scenario, oreQuality, processingSpeed, energySource },
    savedScore: { score: savedScore.score, band: savedScore.band, label: savedScore.label },
    currentScore: { score: currentScore.score, band: currentScore.band, label: currentScore.label },
    improved,
    percentImprovement: savedScore.score > 0
      ? Math.round((1 - currentScore.score / savedScore.score) * 100)
      : 0,
    message: improved
      ? `Your improved decision reduced the damage score by ${Math.round((1 - currentScore.score / savedScore.score) * 100)}%.`
      : 'Your current decision has similar or higher impact than the saved one.',
  });
});

module.exports = router;
