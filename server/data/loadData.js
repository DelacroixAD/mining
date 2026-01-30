/**
 * Load and expose datasets from /server/data (JSON).
 * Used by AI impact engine and routes.
 */

const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '.');

function loadJson(filename) {
  const filepath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(raw);
}

let cache = null;

/**
 * Load all datasets once and cache.
 * @returns {{
 *   emissionsByEnergy: object,
 *   waterByMiningMethod: object,
 *   wasteByOreGrade: object,
 *   recoveryTime: object,
 *   timelineAccumulation: object
 * }}
 */
function loadAll() {
  if (cache) return cache;
  cache = {
    emissionsByEnergy: loadJson('emissions_by_energy.json'),
    waterByMiningMethod: loadJson('water_by_mining_method.json'),
    wasteByOreGrade: loadJson('waste_by_ore_grade.json'),
    recoveryTime: loadJson('recovery_time.json'),
    timelineAccumulation: loadJson('timeline_accumulation.json'),
  };
  return cache;
}

/**
 * Get CO₂ factor for energy source (interpolate if needed).
 */
function getCo2Factor(energySource) {
  const { data } = loadAll().emissionsByEnergy;
  const found = data.find((d) => d.energySource === energySource);
  if (found) return found.co2Factor;
  return 1.0;
}

/**
 * Get water and runoff for mining method.
 */
function getWaterForMethod(method) {
  const { data } = loadAll().waterByMiningMethod;
  const found = data.find((d) => d.method === method);
  if (found) return { waterPerTonnesOre: found.waterPerTonnesOre, runoffRisk: found.runoffRisk };
  return { waterPerTonnesOre: 1.5, runoffRisk: 0.6 };
}

/**
 * Interpolate waste multiplier and tailings for ore grade (0–100).
 */
function getWasteForOreGrade(oreGradePct) {
  const { data } = loadAll().wasteByOreGrade;
  const sorted = [...data].sort((a, b) => b.oreGradePct - a.oreGradePct);
  const clamp = Math.max(0, Math.min(100, oreGradePct));
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (clamp <= a.oreGradePct && clamp >= b.oreGradePct) {
      const t = (a.oreGradePct - clamp) / (a.oreGradePct - b.oreGradePct || 1);
      return {
        wasteMultiplier: a.wasteMultiplier + t * (b.wasteMultiplier - a.wasteMultiplier),
        tailingsPerTonnesOre: a.tailingsPerTonnesOre + t * (b.tailingsPerTonnesOre - a.tailingsPerTonnesOre),
      };
    }
  }
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return {
    wasteMultiplier: clamp >= first.oreGradePct ? first.wasteMultiplier : last.wasteMultiplier,
    tailingsPerTonnesOre: clamp >= first.oreGradePct ? first.tailingsPerTonnesOre : last.tailingsPerTonnesOre,
  };
}

/**
 * Interpolate recovery years for damage score (0–1).
 */
function getRecoveryYears(damageScore) {
  const { data } = loadAll().recoveryTime;
  const sorted = [...data].sort((a, b) => a.damageScore - b.damageScore);
  const s = Math.max(0, Math.min(1, damageScore));
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (s >= a.damageScore && s <= b.damageScore) {
      const t = (s - a.damageScore) / (b.damageScore - a.damageScore || 1);
      const min = Math.round(a.recoveryYearsMin + t * (b.recoveryYearsMin - a.recoveryYearsMin));
      const max = Math.round(a.recoveryYearsMax + t * (b.recoveryYearsMax - a.recoveryYearsMax));
      return { min, max, mid: Math.round((min + max) / 2) };
    }
  }
  const last = sorted[sorted.length - 1];
  return { min: last.recoveryYearsMin, max: last.recoveryYearsMax, mid: Math.round((last.recoveryYearsMin + last.recoveryYearsMax) / 2) };
}

/**
 * Get accumulation factor for timeline years (interpolate).
 */
function getAccumulationFactor(years) {
  const { data } = loadAll().timelineAccumulation;
  const sorted = [...data].sort((a, b) => a.years - b.years);
  const y = Math.max(0, years);
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (y >= a.years && y <= b.years) {
      const t = (y - a.years) / (b.years - a.years || 1);
      return a.accumulationFactor + t * (b.accumulationFactor - a.accumulationFactor);
    }
  }
  return sorted[sorted.length - 1].accumulationFactor;
}

module.exports = {
  loadAll,
  getCo2Factor,
  getWaterForMethod,
  getWasteForOreGrade,
  getRecoveryYears,
  getAccumulationFactor,
};
