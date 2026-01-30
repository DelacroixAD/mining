/**
 * Timeline Simulation - Now → 10y → 50y → 100y
 * Backend projects accumulation; frontend shows degradation over time
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateTimeline, getExplanation } from '../api';
import EnvironmentVisual from '../components/EnvironmentVisual';

const YEARS_OPTIONS = [0, 10, 50, 100];

export default function Timeline({ simState, updateSimState }) {
  const { impact, timelineYears } = simState;
  const [projected, setProjected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [selectedYears, setSelectedYears] = useState(timelineYears);
  const navigate = useNavigate();

  const fetchTimeline = useCallback(async () => {
    if (!impact) return;
    setLoading(true);
    try {
      const data = await calculateTimeline({
        years: selectedYears,
        currentImpact: impact,
      });
      setProjected(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [impact, selectedYears]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  useEffect(() => {
    const display = projected ?? impact;
    if (!display) return;
    getExplanation({ impact: display, years: selectedYears })
      .then((res) => setExplanation(res.explanation || ''))
      .catch(() => setExplanation(''));
  }, [projected, impact, selectedYears]);

  const handleContinue = () => {
    updateSimState({ timelineYears: selectedYears, impact: projected ?? impact });
    navigate('/comparison');
  };

  if (!impact) {
    navigate('/simulator');
    return null;
  }

  const display = projected ?? {
    landDamage: impact.landDamage,
    waterPollution: impact.waterPollution,
    airPollution: impact.airPollution,
    co2Tonnes: impact.co2Tonnes,
    waterCubicMeters: impact.waterCubicMeters,
    wasteTonnes: impact.wasteTonnes,
    recoveryYears: 0,
  };

  return (
    <motion.div
      className="min-h-screen bg-industrial-dark px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-100"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Long-term projection
        </motion.h1>
        <motion.p
          className="mt-2 text-industrial-muted"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          See how impact accumulates over time.
        </motion.p>

        {/* Timeline slider */}
        <motion.div
          className="mt-10 p-6 rounded-xl bg-industrial-panel border border-industrial-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Time: {selectedYears === 0 ? 'Now' : `${selectedYears} years`}
          </label>
          <div className="flex gap-2 flex-wrap">
            {YEARS_OPTIONS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setSelectedYears(y)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedYears === y
                    ? 'bg-industrial-accent text-industrial-dark'
                    : 'bg-industrial-border/50 text-gray-300 hover:bg-industrial-border'
                }`}
              >
                {y === 0 ? 'Now' : `${y}y`}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-industrial-muted text-sm mb-2">Environment over time</p>
            {loading ? (
              <div className="min-h-[240px] flex items-center justify-center rounded-lg bg-industrial-panel border border-industrial-border">
                <span className="text-industrial-muted">Calculating…</span>
              </div>
            ) : (
              <EnvironmentVisual
                landDamage={display.landDamage ?? 0}
                waterPollution={display.waterPollution ?? 0}
                airPollution={display.airPollution ?? 0}
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-4 rounded-lg bg-industrial-panel border border-industrial-border">
            <p className="text-industrial-muted text-sm mb-3">Projected impact</p>
            <div className="space-y-2 tabular-nums">
              <p className="text-industrial-danger text-xl">
                CO₂: {display.co2Tonnes} t
              </p>
              <p className="text-industrial-accent text-xl">
                Water: {display.waterCubicMeters} m³
              </p>
              <p className="text-industrial-ore text-xl">
                Waste: {display.wasteTonnes} t
              </p>
              {display.recoveryYears != null && display.recoveryYears > 0 && (
                <p className="text-industrial-success text-lg mt-2">
                  Est. recovery: {display.recoveryYears} years
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {explanation && (
          <motion.div
            className="mt-6 p-4 rounded-lg bg-industrial-panel/80 border border-industrial-border text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-industrial-muted text-xs uppercase tracking-wide mb-1">Long-term impact</p>
            <p>{explanation}</p>
          </motion.div>
        )}

        <div className="mt-10 flex justify-between">
          <Link to="/tradeoff" className="text-industrial-muted hover:text-gray-200">
            ← Back
          </Link>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 transition-colors"
          >
            Compare with alternative
          </button>
        </div>
      </div>
    </motion.div>
  );
}
