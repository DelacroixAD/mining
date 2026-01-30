/**
 * Explainable AI: which input caused the most damage, which change reduced damage the most.
 */

const impactEngine = require('./impactEngine');
const scoring = require('./scoring');

/**
 * Identify which decision (energy, scenario, ore quality, speed) contributes most to damage.
 * @param {object} params - { scenario, oreQuality, processingSpeed, energySource }
 * @returns { { topCause: string, topCauseReason: string, suggestion: string } }
 */
function getTopCause(params) {
  if (!params) return { topCause: 'Unknown', topCauseReason: '', suggestion: '' };

  const impact = impactEngine.computeImpact(params);
  const base = { ...params };

  const variants = [
    { key: 'energySource', label: 'Energy source', value: params.energySource, alt: 'renewable' },
    { key: 'scenario', label: 'Mining method', value: params.scenario, alt: 'underground' },
    { key: 'oreQuality', label: 'Ore quality', value: params.oreQuality, altNum: Math.min(100, (params.oreQuality || 50) + 30) },
    { key: 'processingSpeed', label: 'Processing speed', value: params.processingSpeed, altNum: Math.max(20, (params.processingSpeed || 50) - 30) },
  ];

  let maxDrop = 0;
  let topCause = 'Energy source';
  let topCauseReason = 'Switching to cleaner energy often has the largest impact.';
  let suggestion = 'Try renewable energy to see the biggest reduction.';

  for (const v of variants) {
    const testParams = { ...base };
    if (v.alt != null) testParams[v.key] = v.alt;
    if (v.altNum != null) testParams[v.key] = v.altNum;
    const testImpact = impactEngine.computeImpact(testParams);
    const scoreNow = scoring.getDamageScore(impact).score;
    const scoreAlt = scoring.getDamageScore(testImpact).score;
    const drop = scoreNow - scoreAlt;
    if (drop > maxDrop) {
      maxDrop = drop;
      topCause = v.label;
      if (v.key === 'energySource') {
        topCauseReason = 'Your energy choice drives most of the CO₂ and air pollution.';
        suggestion = 'Switch to renewable energy to cut emissions and lower the damage score the most.';
      } else if (v.key === 'scenario') {
        topCauseReason = 'This mining method strongly affects water use and land disturbance.';
        suggestion = 'If possible, consider underground mining to reduce surface impact and water use.';
      } else if (v.key === 'oreQuality') {
        topCauseReason = 'Lower ore quality means more waste and more land impact.';
        suggestion = 'Higher-grade ore reduces waste and land damage significantly.';
      } else {
        topCauseReason = 'Faster processing increases emissions and water use.';
        suggestion = 'Reducing processing speed lowers impact with a modest output tradeoff.';
      }
    }
  }

  return { topCause, topCauseReason, suggestion };
}

/**
 * Which single change would reduce damage the most (for "why?" display).
 */
function getBestChange(params) {
  const { suggestion } = getTopCause(params);
  return suggestion;
}

module.exports = { getTopCause, getBestChange };
