/**
 * AI Sustainability Coach
 * Explains why choices are harmful, suggests 2–3 specific changes, shows before vs after % improvement.
 */

const impactEngine = require('./impactEngine');
const recommendations = require('./recommendations');
const scoring = require('./scoring');

/**
 * Get coach response: why harmful, 2–3 changes, before/after impact and % improvement.
 * @param {object} impact - Current impact
 * @param {object} params - { scenario, oreQuality, processingSpeed, energySource }
 * @returns { { whyHarmful: string, suggestions: string[], afterImpact: object, percentImprovement: object } }
 */
function getCoachResponse(impact, params) {
  if (!impact || !params) {
    return {
      whyHarmful: 'Adjust your decisions to see impact and get suggestions.',
      suggestions: [],
      afterImpact: null,
      percentImprovement: null,
    };
  }

  const suggestions = recommendations.getRecommendations(impact, params).slice(0, 3);

  // Simulate "after" by applying best-case choices (renewable, higher grade, lower speed)
  const afterParams = {
    scenario: params.scenario,
    oreQuality: Math.min(100, (params.oreQuality || 50) + 25),
    processingSpeed: Math.max(20, (params.processingSpeed || 50) - 25),
    energySource: 'renewable',
  };
  const afterImpact = impactEngine.computeImpact(afterParams);

  const pctCo2 = impact.co2Tonnes > 0
    ? Math.round((1 - afterImpact.co2Tonnes / impact.co2Tonnes) * 100)
    : 0;
  const pctWater = impact.waterCubicMeters > 0
    ? Math.round((1 - afterImpact.waterCubicMeters / impact.waterCubicMeters) * 100)
    : 0;
  const pctWaste = impact.wasteTonnes > 0
    ? Math.round((1 - afterImpact.wasteTonnes / impact.wasteTonnes) * 100)
    : 0;

  const beforeScore = scoring.getDamageScore(impact);
  const afterScore = scoring.getDamageScore(afterImpact);
  const pctScore = beforeScore.score > 0
    ? Math.round((1 - afterScore.score / beforeScore.score) * 100)
    : 0;

  let whyHarmful = 'Your current choices increase emissions, water use, and waste.';
  if (params.energySource === 'coal') {
    whyHarmful = 'Coal-powered operations drive high CO₂ emissions and air pollution, with lasting climate impact.';
  } else if (params.scenario === 'open-pit' && (impact.waterCubicMeters || 0) > 200) {
    whyHarmful = 'Open-pit mining at this scale uses large amounts of water and increases runoff risk, affecting local water quality.';
  } else if ((params.oreQuality || 50) < 40) {
    whyHarmful = 'Low ore quality means more rock moved and more waste generated per unit of metal, increasing land and water impact.';
  } else if ((params.processingSpeed || 50) > 70) {
    whyHarmful = 'High processing speed pushes emissions and water use up; slowing down can cut impact significantly with a modest output tradeoff.';
  }

  return {
    whyHarmful,
    suggestions,
    afterImpact: {
      co2Tonnes: afterImpact.co2Tonnes,
      waterCubicMeters: afterImpact.waterCubicMeters,
      wasteTonnes: afterImpact.wasteTonnes,
      damageScore: afterScore.score,
    },
    percentImprovement: {
      co2: Math.max(0, pctCo2),
      water: Math.max(0, pctWater),
      waste: Math.max(0, pctWaste),
      damageScore: Math.max(0, pctScore),
    },
  };
}

module.exports = { getCoachResponse };
