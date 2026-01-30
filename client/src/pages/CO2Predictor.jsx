/**
 * CO2 Predictor Page - Uses Python FastAPI backend for emissions prediction
 */
import { useState } from "react";
import { motion } from "framer-motion";

export default function CO2Predictor() {
  const [formData, setFormData] = useState({
    year: 2024,
    commodity: "",
    production_value: 10.5,
    production_unit: "",
    parent_type: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "production_value"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        `Error: ${err.message}. Make sure the Python API is running at http://127.0.0.1:8000`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🌍 CO₂ Emissions Predictor
          </h1>
          <p className="text-xl text-blue-200">
            Predict CO₂ emissions and water impact for mining operations
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max="2100"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Country</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Germany">Germany</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Poland">Poland</option>
                  <option value="Romania">Romania</option>
                  <option value="Other">Other (No water data)</option>
                </select>
              </div>

              {/* Commodity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commodity
                </label>
                <select
                  name="commodity"
                  value={formData.commodity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Commodity</option>
                  <option value="Coal">Coal</option>
                  <option value="Oil">Oil</option>
                  <option value="Gas">Gas</option>
                  <option value="Iron">Iron</option>
                  <option value="Copper">Copper</option>
                </select>
              </div>

              {/* Production Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Production Value
                </label>
                <input
                  type="number"
                  name="production_value"
                  value={formData.production_value}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Production Unit */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Production Unit
                </label>
                <select
                  name="production_unit"
                  value={formData.production_unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Unit</option>
                  <option value="Million tonnes/yr">Million tonnes/yr</option>
                  <option value="Thousand barrels/day">
                    Thousand barrels/day
                  </option>
                  <option value="Million cubic meters/yr">
                    Million cubic meters/yr
                  </option>
                </select>
              </div>

              {/* Parent Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent Type
                </label>
                <select
                  name="parent_type"
                  value={formData.parent_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Type</option>
                  <option value="State-Owned">State-Owned</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Joint Venture">Joint Venture</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Calculating..." : "🔮 Predict Impact"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Results */}
          {results && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 Prediction Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* CO2 Emissions */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                  <div className="text-sm text-gray-600 mb-2">
                    CO₂ Emissions
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.predicted_CO2_Mt.toFixed(4)}
                  </div>
                  <div className="text-sm text-gray-500">Mt CO₂</div>
                </div>

                {/* Water Usage */}
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Water Usage</div>
                  <div className="text-3xl font-bold text-cyan-600">
                    {results.water_used_m3 !== null
                      ? results.water_used_m3.toFixed(4)
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">m³</div>
                </div>

                {/* Water Stress Index */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md">
                  <div className="text-sm text-gray-600 mb-2">
                    Water Stress Index
                  </div>
                  <div className="text-3xl font-bold text-orange-600">
                    {results.water_stress_index !== null
                      ? results.water_stress_index.toFixed(2)
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">(0-1 scale)</div>
                </div>

                {/* Sustainability Score */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md">
                  <div className="text-sm text-gray-600 mb-2">
                    Sustainability Score
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {results.sustainability_score.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-500">(0=best, 1=worst)</div>
                </div>
              </div>

              {/* Score Indicator */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-center font-semibold text-gray-700 mb-4">
                  Overall Impact
                </div>
                <div className="relative h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                  <div
                    className="absolute top-0 w-1 h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ left: `${results.sustainability_score * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>🟢 Low Impact</span>
                  <span>🟡 Medium</span>
                  <span>🔴 High Impact</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
