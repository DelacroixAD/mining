/**
 * Human-scale equivalents for emotional impact.
 * Converts metrics to relatable terms: people's water, cars removed, etc.
 */

// Approximate reference values (annual, typical)
const WATER_PER_PERSON_ANNUAL_M3 = 50;   // domestic + indirect, m³/year
const CO2_PER_CAR_ANNUAL_TONNES = 4.6;   // tonnes CO₂/year per car
const WASTE_EQUIVALENT_TRUCKS = 20;      // tonnes per truckload

/**
 * Get human-scale equivalents for an impact object.
 * @param {object} impact - { co2Tonnes, waterCubicMeters, wasteTonnes }
 * @returns { { waterPeople: number, carsEquivalent: number, trucksWaste: number, waterText: string, carsText: string, wasteText: string } }
 */
function getEquivalents(impact) {
  if (!impact) {
    return {
      waterPeople: 0,
      carsEquivalent: 0,
      trucksWaste: 0,
      waterText: '',
      carsText: '',
      wasteText: '',
    };
  }

  const water = impact.waterCubicMeters || 0;
  const co2 = impact.co2Tonnes || 0;
  const waste = impact.wasteTonnes || 0;

  const waterPeople = Math.round(water / WATER_PER_PERSON_ANNUAL_M3);
  const carsEquivalent = Math.round(co2 / CO2_PER_CAR_ANNUAL_TONNES);
  const trucksWaste = Math.round(waste / WASTE_EQUIVALENT_TRUCKS);

  const waterText = waterPeople >= 1
    ? `Equivalent to annual water use of about ${waterPeople} people`
    : '';
  const carsText = carsEquivalent >= 1
    ? `Roughly equal to ${carsEquivalent} cars off the road for a year`
    : '';
  const wasteText = trucksWaste >= 1
    ? `About ${trucksWaste} truckloads of waste`
    : '';

  return {
    waterPeople,
    carsEquivalent,
    trucksWaste,
    waterText,
    carsText,
    wasteText,
  };
}

module.exports = { getEquivalents };
