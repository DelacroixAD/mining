/**
 * Tradeoff Screen - Profit (left) vs Sustainability (right) slider
 * Backend adjusts impact; visuals update smoothly
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateTradeoff, getExplanation } from '../api';
import EnvironmentVisual from '../components/EnvironmentVisual';
import DamageScore from '../components/DamageScore';

export default function Tradeoff({ simState, updateSimState }) {
  const { impact, tradeoffLevel } = simState;
  const [adjustedImpact, setAdjustedImpact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const navigate = useNavigate();

  const sustainabilityLevel = tradeoffLevel; // 0 = profit, 1 = sustainability

  const fetchTradeoff = useCallback(async () => {
    if (!impact) return;
    setLoading(true);
    try {
      const data = await calculateTradeoff({
        scenario: simState.scenario,
        sustainabilityLevel,
        baseImpact: impact,
      });
      setAdjustedImpact(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [impact, sustainabilityLevel, simState.scenario]);

  useEffect(() => {
    fetchTradeoff();
  }, [fetchTradeoff]);

  useEffect(() => {
    const display = adjustedImpact ?? impact;
    if (!display) return;
    getExplanation({ impact: display })
      .then((res) => setExplanation(res.explanation || ''))
      .catch(() => setExplanation(''));
  }, [adjustedImpact, impact]);

  const handleContinue = () => {
    updateSimState({ impact: adjustedImpact ?? impact, tradeoffLevel: sustainabilityLevel });
    navigate('/timeline');
  };

  if (!impact) {
    navigate('/simulator');
    return null;
  }

  const displayImpact = adjustedImpact ?? impact;
  const landDamage = displayImpact.landDamage ?? 0;
  const waterPollution = displayImpact.waterPollution ?? 0;
  const airPollution = displayImpact.airPollution ?? 0;

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
          Profit vs sustainability
        </motion.h1>
        <motion.p
          className="mt-2 text-industrial-muted"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Move the slider to see how your priority changes impact.
        </motion.p>

        {/* Large slider */}
        <motion.div
          className="mt-10 p-6 rounded-xl bg-industrial-panel border border-industrial-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-industrial-danger font-medium">Profit</span>
            <span className="text-industrial-success font-medium">Sustainability</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sustainabilityLevel * 100}
            onChange={(e) =>
              updateSimState({ tradeoffLevel: Number(e.target.value) / 100 })
            }
            className="w-full h-4 rounded-lg appearance-none cursor-pointer bg-industrial-border accent-industrial-accent"
          />
        </motion.div>

        {/* Visual + numbers */}
        <motion.div
          className="mt-8 grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-industrial-muted text-sm mb-2">Environment</p>
            {loading ? (
              <div className="min-h-[240px] flex items-center justify-center rounded-lg bg-industrial-panel border border-industrial-border">
                <span className="text-industrial-muted">Updating…</span>
              </div>
            ) : (
              <EnvironmentVisual
                landDamage={landDamage}
                waterPollution={waterPollution}
                airPollution={airPollution}
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-4 rounded-lg bg-industrial-panel border border-industrial-border">
            {displayImpact.damageScore0to100 != null && (
              <div className="mb-3">
                <DamageScore score={displayImpact.damageScore0to100} band={displayImpact.damageBand} label={displayImpact.damageLabel} size="sm" />
              </div>
            )}
            <p className="text-industrial-muted text-sm mb-3">Current impact</p>
            <div className="space-y-2 tabular-nums">
              <motion.p
                key={`co2-${displayImpact.co2Tonnes}`}
                className="text-industrial-danger text-xl"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                CO₂: {displayImpact.co2Tonnes} tonnes
              </motion.p>
              <motion.p
                key={`water-${displayImpact.waterCubicMeters}`}
                className="text-industrial-accent text-xl"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Water: {displayImpact.waterCubicMeters} m³
              </motion.p>
              <motion.p
                key={`waste-${displayImpact.wasteTonnes}`}
                className="text-industrial-ore text-xl"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Waste: {displayImpact.wasteTonnes} tonnes
              </motion.p>
            </div>
            {displayImpact.equivalents && (displayImpact.equivalents.waterText || displayImpact.equivalents.carsText) && (
              <p className="text-xs text-gray-400 mt-2">
                {displayImpact.equivalents.waterText && <span>{displayImpact.equivalents.waterText}. </span>}
                {displayImpact.equivalents.carsText && <span>{displayImpact.equivalents.carsText}</span>}
              </p>
            )}
          </div>
        </motion.div>

        {explanation && (
          <motion.div
            className="mt-6 p-4 rounded-lg bg-industrial-panel/80 border border-industrial-border text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-industrial-muted text-xs uppercase tracking-wide mb-1">What this means</p>
            <p>{explanation}</p>
          </motion.div>
        )}

        <div className="mt-10 flex justify-between">
          <Link to="/simulator" className="text-industrial-muted hover:text-gray-200">
            ← Back
          </Link>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 transition-colors"
          >
            See timeline
          </button>
        </div>
      </div>
    </motion.div>
  );
}
