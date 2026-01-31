/**
 * Final Summary - Total CO2, water polluted, ecosystem recovery years + restart
 */
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSummary, getExplanation } from "../api";
import DamageScore from "../components/DamageScore";

export default function Summary({ simState, resetSimulation }) {
  const { impact, timelineYears } = simState;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortExplanation, setShortExplanation] = useState("");
  const navigate = useNavigate();

  const fetchSummary = useCallback(async () => {
    if (!impact) return;
    setLoading(true);
    try {
      const data = await getSummary({
        totalImpact: impact,
        timelineYears: timelineYears ?? 50,
      });
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [impact, timelineYears]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (!impact) return;
    getExplanation({ impact })
      .then((res) => setShortExplanation(res.shortExplanation || ""))
      .catch(() => setShortExplanation(""));
  }, [impact]);

  const handleRestart = () => {
    resetSimulation();
    navigate("/");
  };

  if (!impact) {
    return (
      <div className="min-h-screen bg-industrial-dark flex items-center justify-center">
        <Link
          to="/simulator"
          className="text-industrial-accent hover:underline"
        >
          Start from simulator
        </Link>
      </div>
    );
  }

  const data = summary ?? {
    co2Tonnes: impact.co2Tonnes,
    waterCubicMeters: impact.waterCubicMeters,
    wasteTonnes: impact.wasteTonnes,
    recoveryYears: 25,
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 md:px-6 md:py-12 flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background effects */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-sm">
            <span className="text-sm text-green-300 font-semibold">
              🎯 Complete
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Simulation Summary
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            Your environmental impact results
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent" />
              <span className="text-gray-300">Calculating...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="mt-8 p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-6">
              {data.damageScore0to100 != null && (
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <DamageScore
                    score={data.damageScore0to100}
                    band={data.damageBand}
                    label={data.damageLabel}
                    size="lg"
                  />
                </motion.div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tabular-nums">
                <motion.div
                  className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl mb-2">💨</div>
                  <p className="text-xs text-gray-400 mb-1">Total CO₂</p>
                  <p className="text-xl md:text-2xl font-bold text-red-400 break-words">
                    {data.co2Tonnes}
                  </p>
                  <p className="text-xs text-gray-500">tonnes</p>
                </motion.div>

                <motion.div
                  className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl mb-2">💧</div>
                  <p className="text-xs text-gray-400 mb-1">Water Used</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-400 break-words">
                    {data.waterCubicMeters}
                  </p>
                  <p className="text-xs text-gray-500">m³</p>
                </motion.div>

                <motion.div
                  className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-3xl mb-2">♻️</div>
                  <p className="text-xs text-gray-400 mb-1">Waste</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-400 break-words">
                    {data.wasteTonnes}
                  </p>
                  <p className="text-xs text-gray-500">tonnes</p>
                </motion.div>
              </div>

              {/* Recovery Time */}
              <motion.div
                className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">🌱</span>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400">Ecosystem Recovery</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-400">
                      {data.recoveryYears} years
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Equivalents */}
              {(data.equivalents?.waterText || data.equivalents?.carsText) && (
                <motion.div
                  className="p-5 rounded-xl bg-white/5 border border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xs text-gray-400 font-semibold mb-3">
                    Real-World Equivalents:
                  </p>
                  <div className="space-y-2 text-sm text-gray-300 text-left">
                    {data.equivalents.waterText && (
                      <p className="flex items-start gap-2">
                        <span className="text-blue-400 flex-shrink-0">💧</span>
                        <span className="break-words">
                          {data.equivalents.waterText}
                        </span>
                      </p>
                    )}
                    {data.equivalents.carsText && (
                      <p className="flex items-start gap-2">
                        <span className="text-red-400 flex-shrink-0">🚗</span>
                        <span className="break-words">
                          {data.equivalents.carsText}
                        </span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {shortExplanation && (
                <motion.div
                  className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-sm text-gray-300 text-left break-words">
                    {shortExplanation}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={handleRestart}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl
                       hover:from-green-500 hover:to-emerald-500
                       flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ transition: "transform 0.1s ease-out" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.span>
            <span>Restart</span>
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            <Link
              to="/comparison"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl
                         hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📊</span>
              <span>Compare</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
