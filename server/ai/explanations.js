/**
 * Natural language explanations of impact and consequences.
 * AI logic: rule-based + dataset-driven phrases (no external API required).
 */

const data = require('../data/loadData');

/**
 * Generate a short explanation of what the current impact means.
 * @param {object} impact - { co2Tonnes, waterCubicMeters, wasteTonnes, landDamage, waterPollution, airPollution, recoveryYears? }
 * @param {number} [years=0] - Timeline years for long-term phrasing
 * @returns {string} - Human-readable explanation
 */
function getExplanation(impact, years = 0) {
  if (!impact) return 'No impact data yet.';

  const parts = [];
  const damageScore = ((impact.landDamage || 0) + (impact.waterPollution || 0) + (impact.airPollution || 0)) / 3;
  const recovery = impact.recoveryYears != null ? impact.recoveryYears : data.getRecoveryYears(damageScore).mid;

  if ((impact.waterPollution || 0) > 0.4) {
    parts.push(`This level of water use and runoff can contaminate groundwater and surface water${years >= 10 ? ' for many years' : ''}.`);
  }

  if ((impact.airPollution || 0) > 0.4) {
    parts.push('Air emissions contribute to local air quality decline and long-term climate impact.');
  }

  if ((impact.landDamage || 0) > 0.4) {
    parts.push('Land disturbance and waste accumulation alter habitats and can take decades to stabilize.');
  }

  if (recovery > 20) {
    parts.push(`Ecosystem recovery under these conditions typically takes on the order of ${recovery} years.`);
  } else if (recovery > 5) {
    parts.push(`Recovery may take roughly ${recovery} years with mitigation.`);
  }

  if (years >= 50 && (impact.co2Tonnes || 0) > 100) {
    parts.push('Over decades, cumulative CO₂ from this path adds significantly to climate impact.');
  }

  if (parts.length === 0) {
    return 'Current choices show moderate impact. Lower emissions and water use will reduce long-term environmental cost.';
  }

  return parts.join(' ');
}

/**
 * One-line consequence for summary or tooltip.
 */
function getShortExplanation(impact) {
  if (!impact) return '';
  const damageScore = ((impact.landDamage || 0) + (impact.waterPollution || 0) + (impact.airPollution || 0)) / 3;
  const recovery = impact.recoveryYears != null ? impact.recoveryYears : data.getRecoveryYears(damageScore).mid;
  if (recovery > 30) return `This path can lead to decades of ecosystem recovery.`;
  if (recovery > 10) return `Recovery may take around ${recovery} years.`;
  return `Impact is moderate; recovery is typically under 15 years with good practices.`;
}

module.exports = { getExplanation, getShortExplanation };
