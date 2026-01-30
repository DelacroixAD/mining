/**
 * AI Impact Prediction Engine
 * Uses datasets + interpolation to compute CO₂, water, waste, damage score.
 * Inputs: scenario (mining method), oreGrade (0–100), processingSpeed (0–100), energySource, time (years).
 */

const data = require('../data/loadData');

// Base throughput (tonnes ore equivalent per year) for scaling
const BASE_THROUGHPUT = 100;

/**
 * Compute impact from current decisions (dataset-driven + interpolation).
 * @param {object} params - { scenario, oreQuality (0–100), processingSpeed (0–100), energySource }
 * @returns {object} - { co2Tonnes, waterCubicMeters, wasteTonnes, landDamage, waterPollution, airPollution, damageScore }
 */
function computeImpact(params) {
  const {
    scenario = 'open-pit',
    oreQuality = 50,
    processingSpeed = 50,
    energySource = 'grid',
  } = params;

  const co2Factor = data.getCo2Factor(energySource);
  const { waterPerTonnesOre, runoffRisk } = data.getWaterForMethod(scenario);
  const { wasteMultiplier, tailingsPerTonnesOre } = data.getWasteForOreGrade(oreQuality);

  // Processing speed scales throughput (0.3–1.0)
  const speedScale = 0.3 + (processingSpeed / 100) * 0.7;
  const throughput = BASE_THROUGHPUT * speedScale;

  // CO₂: energy factor × throughput × scenario base (smelting higher)
  const scenarioCo2Base = scenario === 'smelting' ? 1.6 : scenario === 'open-pit' ? 1.2 : 1.0;
  const co2Tonnes = Math.round(co2Factor * scenarioCo2Base * throughput * 0.15);

  // Water: method intensity × throughput × grade factor (low grade = more processing)
  const gradeWaterFactor = 1 + (100 - oreQuality) / 150;
  const waterCubicMeters = Math.round(waterPerTonnesOre * throughput * gradeWaterFactor * 0.8);

  // Waste: waste multiplier × tailings × throughput
  const wasteTonnes = Math.round(wasteMultiplier * tailingsPerTonnesOre * throughput * 0.5);

  // Normalized 0–1 for visuals (land, water, air)
  const landDamage = Math.min(1, (wasteTonnes / 80 + (1 - oreQuality / 100) * 0.4) / 1.2);
  const waterPollution = Math.min(1, (waterCubicMeters / 400) * runoffRisk);
  const airPollution = Math.min(1, (co2Tonnes / 35) * (co2Factor / 1.5));

  const damageScore = (landDamage + waterPollution + airPollution) / 3;

  return {
    co2Tonnes,
    waterCubicMeters,
    wasteTonnes,
    landDamage,
    waterPollution,
    airPollution,
    damageScore,
  };
}

/**
 * Apply tradeoff (sustainability level 0–1) to impact.
 */
function applyTradeoff(baseImpact, sustainabilityLevel) {
  const factor = 1 - sustainabilityLevel * 0.65;
  return {
    co2Tonnes: Math.round(baseImpact.co2Tonnes * factor),
    waterCubicMeters: Math.round(baseImpact.waterCubicMeters * factor),
    wasteTonnes: Math.round(baseImpact.wasteTonnes * factor),
    landDamage: Math.min(1, (baseImpact.landDamage || 0.5) * factor),
    waterPollution: Math.min(1, (baseImpact.waterPollution || 0.5) * factor),
    airPollution: Math.min(1, (baseImpact.airPollution || 0.5) * factor),
    damageScore: Math.min(1, (baseImpact.damageScore || 0.5) * factor),
  };
}

/**
 * Project impact over time using timeline accumulation dataset.
 */
function projectTimeline(currentImpact, years) {
  const factor = data.getAccumulationFactor(years);
  const recovery = data.getRecoveryYears(
    (currentImpact.landDamage + currentImpact.waterPollution + currentImpact.airPollution) / 3
  );
  const recoveryYears = Math.round(recovery.mid * (1 + years / 80));

  return {
    years,
    co2Tonnes: Math.round(currentImpact.co2Tonnes * factor),
    waterCubicMeters: Math.round(currentImpact.waterCubicMeters * factor),
    wasteTonnes: Math.round(currentImpact.wasteTonnes * factor),
    landDamage: Math.min(1, (currentImpact.landDamage || 0.5) * Math.min(1.5, 1 + years / 80)),
    waterPollution: Math.min(1, (currentImpact.waterPollution || 0.5) * Math.min(1.5, 1 + years / 80)),
    airPollution: Math.min(1, (currentImpact.airPollution || 0.5) * Math.min(1.5, 1 + years / 80)),
    recoveryYears,
  };
}

/**
 * Sustainable alternative: same scenario but best energy, higher grade assumption, lower speed.
 */
function getSustainableAlternative(userImpact, params) {
  const bestCase = computeImpact({
    scenario: params?.scenario || 'open-pit',
    oreQuality: Math.min(100, (params?.oreQuality || 50) + 20),
    processingSpeed: Math.max(20, (params?.processingSpeed || 50) - 20),
    energySource: 'renewable',
  });
  return {
    co2Tonnes: bestCase.co2Tonnes,
    waterCubicMeters: bestCase.waterCubicMeters,
    wasteTonnes: bestCase.wasteTonnes,
    landDamage: bestCase.landDamage,
    waterPollution: bestCase.waterPollution,
    airPollution: bestCase.airPollution,
  };
}

module.exports = {
  computeImpact,
  applyTradeoff,
  projectTimeline,
  getSustainableAlternative,
};
