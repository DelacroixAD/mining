/**
 * Decision Simulator – Controls + environment + Damage Score, AI Coach, Scale, Why?, equivalents, save/compare
 */
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateImpact,
  getCoach,
  getExplanation,
  getScaleImpact,
  getWhy,
  saveScenario,
  compareScenario,
  predictWithMLModel,
} from "../api";
import EnvironmentVisual from "../components/EnvironmentVisual";
import AnimatedNumber from "../components/AnimatedNumber";
import DamageScore from "../components/DamageScore";

const ENERGY_OPTIONS = [
  { value: "coal", label: "Coal" },
  { value: "gas", label: "Natural gas" },
  { value: "grid", label: "Grid mix" },
  { value: "renewable", label: "Renewable" },
];

const SCALE_OPTIONS = [
  { value: "mines100", label: "100 mines" },
  { value: "country", label: "Country scale" },
  { value: "global", label: "Global industry" },
];

export default function DecisionSimulator({ simState, updateSimState }) {
  const { scenario, oreQuality, processingSpeed, energySource } = simState;
  const [impact, setImpact] = useState(simState.impact || null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showCoach, setShowCoach] = useState(false);
  const [coach, setCoach] = useState(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [scaleMode, setScaleMode] = useState(null);
  const [scaled, setScaled] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [whyData, setWhyData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [compareResult, setCompareResult] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const navigate = useNavigate();

  const fetchImpact = useCallback(async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const data = await calculateImpact({
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setImpact(data);
      updateSimState({ impact: data });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [scenario, oreQuality, processingSpeed, energySource, updateSimState]);

  useEffect(() => {
    fetchImpact();
  }, [fetchImpact]);

  useEffect(() => {
    if (!impact) return;
    getExplanation({ impact })
      .then((res) => setExplanation(res.explanation || ""))
      .catch(() => setExplanation(""));
  }, [impact]);

  useEffect(() => {
    if (scaleMode && impact) {
      getScaleImpact({ impact, scale: scaleMode })
        .then(setScaled)
        .catch(() => setScaled(null));
    } else {
      setScaled(null);
    }
  }, [scaleMode, impact]);

  const handleCoach = useCallback(async () => {
    if (!impact) return;
    setLoadingCoach(true);
    setShowCoach(true);
    try {
      const res = await getCoach({
        impact,
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setCoach(res);
    } catch (e) {
      console.error(e);
      setCoach({
        whyHarmful: "Unable to load coach.",
        suggestions: [],
        percentImprovement: null,
      });
    } finally {
      setLoadingCoach(false);
    }
  }, [impact, scenario, oreQuality, processingSpeed, energySource]);

  const fetchMLPrediction = useCallback(async () => {
    setMlLoading(true);
    setMlPrediction(null);
    try {
      // Map scenario and energy to your model's expected inputs
      const commodity = scenario === "underground" ? "Iron" : "Coal";
      const parent_type =
        energySource === "renewable" ? "Private" : "State-Owned";

      const mlData = await predictWithMLModel({
        year: 2024,
        commodity: commodity,
        production_value: oreQuality / 10, // Scale to reasonable production value
        production_unit: "Million tonnes/yr",
        parent_type: parent_type,
        country: "Germany",
      });
      setMlPrediction(mlData);
    } catch (e) {
      console.error("ML Prediction failed:", e);
      setMlPrediction({
        error: "ML model unavailable. Make sure Python API is running.",
      });
    } finally {
      setMlLoading(false);
    }
  }, [scenario, oreQuality, energySource]);

  useEffect(() => {
    if (scenario && oreQuality !== undefined) {
      fetchMLPrediction();
    }
  }, [fetchMLPrediction]);

  const handleWhy = useCallback(async () => {
    setShowWhy(true);
    try {
      const res = await getWhy({
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setWhyData(res);
    } catch (e) {
      setWhyData({ topCause: "Unknown", topCauseReason: "", suggestion: "" });
    }
  }, [scenario, oreQuality, processingSpeed, energySource]);

  const handleSaveScenario = useCallback(async () => {
    if (!impact) return;
    try {
      await saveScenario({
        impact,
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
  }, [impact, scenario, oreQuality, processingSpeed, energySource]);

  const handleCompare = useCallback(async () => {
    if (!impact) return;
    try {
      const res = await compareScenario({
        currentImpact: impact,
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setCompareResult(res);
    } catch (e) {
      console.error(e);
    }
  }, [impact, scenario, oreQuality, processingSpeed, energySource]);

  if (!scenario) {
    navigate("/scenario");
    return null;
  }

  const landDamage = impact?.landDamage ?? 0;
  const waterPollution = impact?.waterPollution ?? 0;
  const airPollution = impact?.airPollution ?? 0;
  const score = impact?.damageScore0to100 ?? 0;
  const band = impact?.damageBand ?? "green";
  const label = impact?.damageLabel ?? "Low damage";
  const equiv = impact?.equivalents ?? {};

  return (
    <motion.div
      className="min-h-screen bg-industrial-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col lg:flex-row h-full min-h-screen">
        {/* Left: controls */}
        <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-industrial-border overflow-y-auto">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Adjust decisions
          </motion.h1>
          <p className="mt-1 text-industrial-muted">
            Changes update impact in real time.
          </p>

          {/* Damage Score – real-time */}
          {impact && (
            <motion.div
              className="mt-6 flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <DamageScore score={score} band={band} label={label} size="md" />
              <button
                type="button"
                onClick={handleWhy}
                className="text-industrial-muted hover:text-industrial-accent text-sm font-medium flex items-center gap-1"
                title="Which input caused most damage? Which change helps most?"
              >
                Why?
              </button>
            </motion.div>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ore quality: {oreQuality}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={oreQuality}
                onChange={(e) =>
                  updateSimState({ oreQuality: Number(e.target.value) })
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-industrial-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Processing speed: {processingSpeed}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={processingSpeed}
                onChange={(e) =>
                  updateSimState({ processingSpeed: Number(e.target.value) })
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-industrial-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Energy source
              </label>
              <select
                value={energySource}
                onChange={(e) =>
                  updateSimState({ energySource: e.target.value })
                }
                className="w-full px-4 py-2 bg-industrial-panel border border-industrial-border rounded-lg text-gray-200 focus:ring-2 focus:ring-industrial-accent"
              >
                {ENERGY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {impact && (
            <motion.div
              className="mt-8 p-4 rounded-lg bg-industrial-panel border border-industrial-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-industrial-muted mb-2">
                Current impact
              </p>
              <div className="flex flex-wrap gap-4 tabular-nums">
                <span className="text-industrial-danger">
                  CO₂: <AnimatedNumber value={impact.co2Tonnes} suffix=" t" />
                </span>
                <span className="text-industrial-accent">
                  Water:{" "}
                  <AnimatedNumber
                    value={impact.waterCubicMeters}
                    suffix=" m³"
                  />
                </span>
                <span className="text-industrial-ore">
                  Waste:{" "}
                  <AnimatedNumber value={impact.wasteTonnes} suffix=" t" />
                </span>
              </div>
              {(equiv.waterText || equiv.carsText || equiv.wasteText) && (
                <p className="text-xs text-gray-400 mt-2">
                  {equiv.waterText && <span>{equiv.waterText}. </span>}
                  {equiv.carsText && <span>{equiv.carsText}. </span>}
                  {equiv.wasteText && <span>{equiv.wasteText}</span>}
                </p>
              )}
            </motion.div>
          )}

          {/* ML Model Predictions */}
          {mlLoading && (
            <motion.div
              className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-purple-300">
                🤖 Loading ML predictions...
              </p>
            </motion.div>
          )}

          {mlPrediction && !mlPrediction.error && (
            <motion.div
              className="mt-4 p-5 rounded-lg bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <p className="text-sm font-semibold text-purple-300">
                  ML Model Predictions
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">CO₂ Emissions</p>
                  <p className="text-lg font-bold text-purple-300">
                    {mlPrediction.predicted_CO2_Mt.toFixed(4)}{" "}
                    <span className="text-xs">Mt</span>
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Water Usage</p>
                  <p className="text-lg font-bold text-blue-300">
                    {mlPrediction.water_used_m3 !== null
                      ? mlPrediction.water_used_m3.toFixed(2)
                      : "N/A"}{" "}
                    <span className="text-xs">m³</span>
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Water Stress</p>
                  <p className="text-lg font-bold text-cyan-300">
                    {mlPrediction.water_stress_index !== null
                      ? mlPrediction.water_stress_index.toFixed(2)
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Sustainability</p>
                  <p className="text-lg font-bold text-yellow-300">
                    {mlPrediction.sustainability_score.toFixed(3)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                <span className="text-purple-400">●</span> Powered by trained
                Random Forest model
              </p>
            </motion.div>
          )}

          {mlPrediction && mlPrediction.error && (
            <motion.div
              className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-red-300">⚠️ {mlPrediction.error}</p>
            </motion.div>
          )}

          {/* AI Sustainability Coach */}
          <motion.button
            type="button"
            onClick={handleCoach}
            className="mt-4 px-4 py-2 rounded-lg bg-industrial-success/15 border border-industrial-success/50 text-industrial-success text-sm font-medium hover:bg-industrial-success/25 transition-colors"
          >
            AI Sustainability Coach
          </motion.button>

          {/* Scale This Decision */}
          <div className="mt-4">
            <p className="text-xs text-industrial-muted mb-2">
              Scale this decision
            </p>
            <div className="flex gap-2 flex-wrap">
              {SCALE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    setScaleMode(scaleMode === o.value ? null : o.value)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    scaleMode === o.value
                      ? "bg-industrial-accent text-industrial-dark"
                      : "bg-industrial-border/50 text-gray-300 hover:bg-industrial-border"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save & Compare */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSaveScenario}
              disabled={!impact || saved}
              className="px-3 py-1.5 rounded-lg text-sm border border-industrial-border text-gray-300 hover:bg-industrial-panel disabled:opacity-50"
            >
              {saved ? "Saved" : "Save this decision"}
            </button>
            <button
              type="button"
              onClick={handleCompare}
              disabled={!impact}
              className="px-3 py-1.5 rounded-lg text-sm border border-industrial-accent/50 text-industrial-accent hover:bg-industrial-accent/10"
            >
              Compare with saved
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/scenario"
              className="text-industrial-muted hover:text-gray-200"
            >
              ← Back
            </Link>
            <button
              onClick={() => {
                updateSimState({ impact });
                navigate("/tradeoff");
              }}
              className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 transition-colors"
            >
              Continue to tradeoff
            </button>
          </div>
        </div>

        {/* Right: visual + explanation + coach + scale + compare */}
        <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center overflow-y-auto">
          <p className="text-industrial-muted text-sm mb-4">
            Environment (land, water, air)
          </p>
          {loading ? (
            <div className="min-h-[280px] flex items-center justify-center rounded-lg bg-industrial-panel border border-industrial-border">
              <span className="text-industrial-muted">Calculating…</span>
            </div>
          ) : (
            <EnvironmentVisual
              landDamage={landDamage}
              waterPollution={waterPollution}
              airPollution={airPollution}
            />
          )}

          {explanation && (
            <motion.div
              className="mt-4 p-4 rounded-lg bg-industrial-panel/80 border border-industrial-border text-sm text-gray-300"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-industrial-muted text-xs uppercase tracking-wide mb-1">
                What this means
              </p>
              <p>{explanation}</p>
            </motion.div>
          )}

          {/* Scaled impact */}
          <AnimatePresence>
            {scaled && (
              <motion.div
                className="mt-4 p-4 rounded-lg bg-industrial-panel border border-industrial-accent/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-industrial-accent text-sm font-medium mb-2">
                  If {scaled.scaleLabel} did this
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  {scaled.summary?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Coach panel */}
          <AnimatePresence>
            {showCoach && (
              <motion.div
                className="mt-4 p-4 rounded-lg bg-industrial-panel border-2 border-industrial-success/40"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-industrial-success font-medium">
                    AI Sustainability Coach
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCoach(false)}
                    className="text-industrial-muted hover:text-gray-200 text-sm"
                  >
                    Close
                  </button>
                </div>
                {loadingCoach ? (
                  <p className="text-industrial-muted text-sm">Loading…</p>
                ) : (
                  coach && (
                    <>
                      <p className="text-sm text-gray-300 mb-2">
                        <strong>Why this choice is harmful:</strong>{" "}
                        {coach.whyHarmful}
                      </p>
                      <p className="text-xs text-industrial-muted mb-2">
                        Suggestions:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
                        {(coach.suggestions || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                      {coach.percentImprovement && (
                        <p className="text-sm text-industrial-success">
                          If you apply these changes: CO₂ −
                          {coach.percentImprovement.co2}%, Water −
                          {coach.percentImprovement.water}%, Waste −
                          {coach.percentImprovement.waste}%, Damage score −
                          {coach.percentImprovement.damageScore}%.
                        </p>
                      )}
                    </>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Why? modal */}
          <AnimatePresence>
            {showWhy && whyData && (
              <motion.div
                className="mt-4 p-4 rounded-lg bg-industrial-panel border border-industrial-accent/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-industrial-accent font-medium">
                    Explainable AI
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowWhy(false)}
                    className="text-industrial-muted hover:text-gray-200 text-sm"
                  >
                    Close
                  </button>
                </div>
                <p className="text-sm text-gray-300">
                  <strong>Biggest driver of damage:</strong> {whyData.topCause}.{" "}
                  {whyData.topCauseReason}
                </p>
                <p className="text-sm text-industrial-success mt-2">
                  <strong>Best single change:</strong> {whyData.suggestion}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compare result side-by-side */}
          <AnimatePresence>
            {compareResult && compareResult.saved && (
              <motion.div
                className="mt-4 grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-3 rounded-lg bg-industrial-panel border border-industrial-border">
                  <p className="text-xs text-industrial-muted mb-1">
                    Saved decision
                  </p>
                  <DamageScore
                    score={compareResult.savedScore?.score}
                    band={compareResult.savedScore?.band}
                    label={compareResult.savedScore?.label}
                    size="sm"
                  />
                </div>
                <div className="p-3 rounded-lg bg-industrial-panel border border-industrial-success/30">
                  <p className="text-xs text-industrial-muted mb-1">Current</p>
                  <DamageScore
                    score={compareResult.currentScore?.score}
                    band={compareResult.currentScore?.band}
                    label={compareResult.currentScore?.label}
                    size="sm"
                  />
                </div>
                <p className="col-span-2 text-sm text-gray-300">
                  {compareResult.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
