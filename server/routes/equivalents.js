/**
 * Human-scale equivalents (people's water, cars off road)
 * POST /api/equivalents - emotional impact copy
 */

const express = require('express');
const router = express.Router();
const equivalents = require('../ai/equivalents');

router.post('/', (req, res) => {
  const { impact } = req.body;
  if (!impact) return res.status(400).json({ error: 'impact required' });
  const result = equivalents.getEquivalents(impact);
  res.json(result);
});

module.exports = router;
