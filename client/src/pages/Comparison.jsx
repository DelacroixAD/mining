/**
 * Comparison Screen - User's choice vs sustainable alternative (side by side)
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getComparison } from '../api';
import EnvironmentVisual from '../components/EnvironmentVisual';

export default function Comparison({ simState, updateSimState }) {
  const { impact, scenario, oreQuality, processingSpeed, energySource } = simState;
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchComparison = useCallback(async () => {
    if (!impact) return;
    setLoading(true);
    try {
      const data = await getComparison({
        userImpact: impact,
        scenario,
        oreQuality,
        processingSpeed,
        energySource,
      });
      setComparison(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [impact, scenario, oreQuality, processingSpeed, energySource]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const handleContinue = () => {
    updateSimState({ finalImpact: impact });
    navigate('/summary');
  };

  if (!impact) {
    navigate('/simulator');
    return null;
  }

  const user = comparison?.user ?? impact;
  const alt = comparison?.alternative ?? null;

  return (
    <motion.div
      className="min-h-screen bg-industrial-dark px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-100"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Your choice vs sustainable alternative
        </motion.h1>
        <motion.p
          className="mt-2 text-industrial-muted"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Side-by-side impact comparison.
        </motion.p>

        {loading ? (
          <div className="mt-10 min-h-[320px] flex items-center justify-center rounded-xl bg-industrial-panel border border-industrial-border">
            <span className="text-industrial-muted">Loading comparison…</span>
          </div>
        ) : (
          <motion.div
            className="mt-10 grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* User's choice */}
            <div className="p-6 rounded-xl bg-industrial-panel border border-industrial-border">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">
                Your choice
              </h2>
              <EnvironmentVisual
                landDamage={user.landDamage ?? 0}
                waterPollution={user.waterPollution ?? 0}
                airPollution={user.airPollution ?? 0}
              />
              <div className="mt-4 space-y-1 tabular-nums text-sm">
                <p className="text-industrial-danger">CO₂: {user.co2Tonnes} t</p>
                <p className="text-industrial-accent">Water: {user.waterCubicMeters} m³</p>
                <p className="text-industrial-ore">Waste: {user.wasteTonnes} t</p>
              </div>
            </div>

            {/* Sustainable alternative */}
            <div className="p-6 rounded-xl bg-industrial-panel border border-industrial-success/30">
              <h2 className="text-lg font-semibold text-industrial-success mb-4">
                Sustainable alternative
              </h2>
              {alt ? (
                <>
                  <EnvironmentVisual
                    landDamage={alt.landDamage ?? 0}
                    waterPollution={alt.waterPollution ?? 0}
                    airPollution={alt.airPollution ?? 0}
                  />
                  <div className="mt-4 space-y-1 tabular-nums text-sm text-industrial-muted">
                    <p>CO₂: {alt.co2Tonnes} t</p>
                    <p>Water: {alt.waterCubicMeters} m³</p>
                    <p>Waste: {alt.wasteTonnes} t</p>
                  </div>
                </>
              ) : (
                <div className="min-h-[240px] flex items-center justify-center text-industrial-muted">
                  No comparison data
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex justify-between">
          <Link to="/timeline" className="text-industrial-muted hover:text-gray-200">
            ← Back
          </Link>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 transition-colors"
          >
            See summary
          </button>
        </div>
      </div>
    </motion.div>
  );
}
