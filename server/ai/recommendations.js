/**
 * AI Recommendation Engine
 * Generates human-readable suggestions to reduce impact based on current choices + dataset comparison.
 */

const data = require('../data/loadData');

/**
 * Generate recommendations from current impact and decision params.
 * @param {object} impact - Current impact (co2Tonnes, waterCubicMeters, wasteTonnes, ...)
 * @param {object} params - { scenario, oreQuality, processingSpeed, energySource }
 * @returns {string[]} - Array of suggestion strings
 */
function getRecommendations(impact, params) {
  const suggestions = [];
  const { energySource, oreQuality, processingSpeed, scenario } = params || {};

  const co2Factor = data.getCo2Factor(energySource || 'grid');
  const renewableFactor = data.getCo2Factor('renewable');
  const coalFactor = data.getCo2Factor('coal');

  if (energySource !== 'renewable' && co2Factor > 1.2) {
    const pct = Math.round((1 - renewableFactor / co2Factor) * 100);
    suggestions.push(`Switching to renewable energy could reduce CO₂ emissions by about ${pct}%.`);
  }

  if (energySource === 'coal') {
    suggestions.push('Coal is the most carbon-intensive option. Natural gas or grid mix would lower emissions.');
  }

  const { waterPerTonnesOre, runoffRisk } = data.getWaterForMethod(scenario || 'open-pit');
  if (scenario === 'open-pit' && (impact.waterCubicMeters || 0) > 200) {
    suggestions.push('Open-pit mining uses more water and increases runoff risk. Underground mining typically uses less water.');
  }

  if ((processingSpeed || 50) > 60 && (impact.waterCubicMeters || impact.co2Tonnes)) {
    suggestions.push('Reducing processing speed lowers water use and emissions, with a smaller throughput tradeoff.');
  }

  if ((oreQuality || 50) < 50) {
    suggestions.push('Higher ore quality reduces waste rock and tailings. Lower-grade ore requires more material moved per unit metal.');
  }

  const { recoveryTime } = data.loadAll();
  if ((impact.landDamage + impact.waterPollution + impact.airPollution) / 3 > 0.5) {
    suggestions.push('Your current choices lead to high cumulative damage. Shifting toward sustainability sliders and renewable energy will shorten ecosystem recovery time.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your current setup is already relatively low-impact. Consider renewable energy and lower processing speed for further gains.');
  }

  return suggestions.slice(0, 5);
}

module.exports = { getRecommendations };
