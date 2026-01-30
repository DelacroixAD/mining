/**
 * Explainable AI: which input caused most damage, which change helps most
 * POST /api/why - topCause, topCauseReason, suggestion
 */

const express = require('express');
const router = express.Router();
const explainableWhy = require('../ai/explainableWhy');

router.post('/', (req, res) => {
  const { scenario, oreQuality, processingSpeed, energySource } = req.body;
  const result = explainableWhy.getTopCause({
    scenario,
    oreQuality,
    processingSpeed,
    energySource,
  });
  res.json(result);
});

module.exports = router;
