/**
 * Sustainability Simulator - Express Backend
 * Mining & Metallurgy environmental impact API
 */

const express = require('express');
const cors = require('cors');
const impactRoutes = require('./routes/impact');
const tradeoffRoutes = require('./routes/tradeoff');
const timelineRoutes = require('./routes/timeline');
const comparisonRoutes = require('./routes/comparison');
const summaryRoutes = require('./routes/summary');
const recommendationsRoutes = require('./routes/recommendations');
const explainRoutes = require('./routes/explain');
const coachRoutes = require('./routes/coach');
const scoreRoutes = require('./routes/score');
const scaleImpactRoutes = require('./routes/scaleImpact');
const whyRoutes = require('./routes/why');
const equivalentsRoutes = require('./routes/equivalents');
const demoRoutes = require('./routes/demo');
const scenarioRoutes = require('./routes/scenario');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/impact', impactRoutes);
app.use('/api/tradeoff', tradeoffRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/scale-impact', scaleImpactRoutes);
app.use('/api/why', whyRoutes);
app.use('/api/equivalents', equivalentsRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/scenario', scenarioRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'sustainability-simulator' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});