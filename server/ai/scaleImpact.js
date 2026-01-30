/**
 * "What If Everyone Did This?" – scale impact to 100 mines, country, global.
 * Returns relatable terms: cities of emissions, people's water, etc.
 */

const equivalents = require('./equivalents');

// Scale factors (relative to 1 mine/site)
const SCALES = {
  mines100: 100,
  country: 2500,   // order of magnitude for a mining country
  global: 50000,   // order of magnitude global industry
};

/**
 * Scale impact and return human-readable descriptions.
 * @param {object} impact - Single-site impact
 * @param {string} scale - 'mines100' | 'country' | 'global'
 * @returns { { scaleLabel: string, impact: object, equivalents: object, summary: string[] } }
 */
function getScaledImpact(impact, scale) {
  if (!impact) return { scaleLabel: '', impact: {}, equivalents: {}, summary: [] };

  const factor = SCALES[scale] ?? SCALES.mines100;
  const scaled = {
    co2Tonnes: Math.round((impact.co2Tonnes || 0) * factor),
    waterCubicMeters: Math.round((impact.waterCubicMeters || 0) * factor),
    wasteTonnes: Math.round((impact.wasteTonnes || 0) * factor),
    landDamage: Math.min(1, (impact.landDamage || 0) * Math.min(2, Math.log10(1 + factor))),
    waterPollution: Math.min(1, (impact.waterPollution || 0) * Math.min(2, Math.log10(1 + factor))),
    airPollution: Math.min(1, (impact.airPollution || 0) * Math.min(2, Math.log10(1 + factor))),
  };

  const equiv = equivalents.getEquivalents(scaled);
  const summary = [];

  if (equiv.waterPeople >= 1) summary.push(equiv.waterText);
  if (equiv.carsEquivalent >= 1) summary.push(equiv.carsText);
  if (equiv.trucksWaste >= 1) summary.push(equiv.wasteText);

  const scaleLabels = {
    mines100: '100 mines',
    country: 'A country-scale industry',
    global: 'Global industry',
  };
  const scaleLabel = scaleLabels[scale] || 'Scaled';

  return {
    scaleLabel,
    scale,
    factor,
    impact: scaled,
    equivalents: equiv,
    summary,
  };
}

module.exports = { getScaledImpact, SCALES };
