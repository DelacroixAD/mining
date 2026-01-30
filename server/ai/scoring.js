/**
 * Environmental Damage Score (0–100)
 * Composite from CO₂, water pollution, waste, recovery time.
 * Color band: green (low), yellow (moderate), red (high).
 */

const data = require('../data/loadData');

// Weights for composite (normalized so max ≈ 100)
const WEIGHTS = {
  co2: 0.25,
  water: 0.25,
  waste: 0.2,
  land: 0.1,
  waterPollution: 0.1,
  airPollution: 0.1,
};

// Reference max values for normalization (from typical dataset range)
const REF = {
  co2Tonnes: 50,
  waterCubicMeters: 500,
  wasteTonnes: 80,
};

/**
 * Compute composite damage score 0–100 from impact object.
 * @param {object} impact - { co2Tonnes, waterCubicMeters, wasteTonnes, landDamage, waterPollution, airPollution }
 * @param {number} [recoveryYears] - optional, adds to severity
 * @returns { { score: number, band: 'green'|'yellow'|'red', label: string } }
 */
function getDamageScore(impact, recoveryYears) {
  if (!impact) return { score: 0, band: 'green', label: 'Low damage' };

  const co2Norm = Math.min(1, (impact.co2Tonnes || 0) / REF.co2Tonnes);
  const waterNorm = Math.min(1, (impact.waterCubicMeters || 0) / REF.waterCubicMeters);
  const wasteNorm = Math.min(1, (impact.wasteTonnes || 0) / REF.wasteTonnes);
  const land = impact.landDamage ?? 0;
  const waterPol = impact.waterPollution ?? 0;
  const airPol = impact.airPollution ?? 0;

  const recoveryNorm = recoveryYears != null ? Math.min(1, recoveryYears / 60) : 0;
  const composite =
    WEIGHTS.co2 * co2Norm +
    WEIGHTS.water * waterNorm +
    WEIGHTS.waste * wasteNorm +
    WEIGHTS.land * land +
    WEIGHTS.waterPollution * waterPol +
    WEIGHTS.airPollution * airPol +
    recoveryNorm * 0.05;

  const score = Math.round(Math.min(100, composite * 100));
  let band = 'green';
  let label = 'Low damage';
  if (score >= 60) {
    band = 'red';
    label = 'High damage';
  } else if (score >= 35) {
    band = 'yellow';
    label = 'Moderate damage';
  }

  return { score, band, label };
}

module.exports = { getDamageScore };
