/**
 * Long-term projection (dataset + AI engine).
 * POST /api/timeline - 10, 50, 100 year outcomes from accumulation data.
 */

const express = require('express');
const router = express.Router();
const impactEngine = require('../ai/impactEngine');

/**
 * POST /api/timeline
 * Body: { years (0|10|50|100), currentImpact }
 * Returns projected accumulated impact and recovery years
 */
router.post('/', (req, res) => {
  const { years = 0, currentImpact } = req.body;
  if (!currentImpact) {
    return res.status(400).json({ error: 'currentImpact required' });
  }
  const y = Math.max(0, Number(years) || 0);
  const result = impactEngine.projectTimeline(currentImpact, y);
  res.json(result);
});

module.exports = router;
