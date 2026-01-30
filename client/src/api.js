/**
 * REST API client for sustainability simulator backend
 */

const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

/** POST /api/impact - real-time impact from scenario + controls */
export async function calculateImpact(body) {
  return request('/impact', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/tradeoff - profit vs sustainability */
export async function calculateTradeoff(body) {
  return request('/tradeoff', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/timeline - long-term projection */
export async function calculateTimeline(body) {
  return request('/timeline', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/comparison - user vs sustainable alternative */
export async function getComparison(body) {
  return request('/comparison', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/summary - final totals and recovery */
export async function getSummary(body) {
  return request('/summary', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/recommendations - AI suggestions to reduce impact */
export async function getRecommendations(body) {
  return request('/recommendations', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/explain - natural language explanation of impact */
export async function getExplanation(body) {
  return request('/explain', { method: 'POST', body: JSON.stringify(body) });
}

/** POST to Python ML API - Predict CO2 emissions with trained model */
export async function predictWithMLModel(body) {
  const response = await fetch('http://127.0.0.1:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`ML API Error: ${response.status}`);
  return response.json();
}

/** POST /api/coach - AI Sustainability Coach: why harmful, 2–3 changes, before/after % */
export async function getCoach(body) {
  return request('/coach', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/score - damage score 0–100 and band (green/yellow/red) */
export async function getScore(body) {
  return request('/score', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/scale-impact - scaled impact (100 mines / country / global) */
export async function getScaleImpact(body) {
  return request('/scale-impact', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/why - which input caused most damage, which change helps most */
export async function getWhy(body) {
  return request('/why', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/equivalents - human-scale (people's water, cars off road) */
export async function getEquivalents(body) {
  return request('/equivalents', { method: 'POST', body: JSON.stringify(body) });
}

/** GET /api/demo/steps - demo mode steps */
export async function getDemoSteps() {
  return request('/demo/steps');
}

/** POST /api/demo/outcome - demo mode final outcome */
export async function getDemoOutcome(body) {
  return request('/demo/outcome', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/scenario/save - save current scenario */
export async function saveScenario(body) {
  return request('/scenario/save', { method: 'POST', body: JSON.stringify(body) });
}

/** POST /api/scenario/compare - compare saved vs current */
export async function compareScenario(body) {
  return request('/scenario/compare', { method: 'POST', body: JSON.stringify(body) });
}
