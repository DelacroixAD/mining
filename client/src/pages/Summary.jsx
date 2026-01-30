/**
 * Final Summary - Total CO2, water polluted, ecosystem recovery years + restart
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSummary, getExplanation } from '../api';
import DamageScore from '../components/DamageScore';

export default function Summary({ simState, resetSimulation }) {
  const { impact, timelineYears } = simState;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shortExplanation, setShortExplanation] = useState('');
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
      .then((res) => setShortExplanation(res.shortExplanation || ''))
      .catch(() => setShortExplanation(''));
  }, [impact]);

  const handleRestart = () => {
    resetSimulation();
    navigate('/');
  };

  if (!impact) {
    return (
      <div className="min-h-screen bg-industrial-dark flex items-center justify-center">
        <Link to="/simulator" className="text-industrial-accent hover:underline">
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
      className="min-h-screen bg-industrial-dark px-6 py-12 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl w-full text-center">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-100"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Simulation summary
        </motion.h1>
        <motion.p
          className="mt-2 text-industrial-muted"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Your choices and their long-term impact.
        </motion.p>

        {loading ? (
          <div className="mt-12 text-industrial-muted">Calculating…</div>
        ) : (
          <motion.div
            className="mt-12 p-8 rounded-xl bg-industrial-panel border border-industrial-border space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="tabular-nums">
              {data.damageScore0to100 != null && (
                <div className="mb-4">
                  <DamageScore score={data.damageScore0to100} band={data.damageBand} label={data.damageLabel} size="lg" />
                </div>
              )}
              <p className="text-industrial-danger text-2xl font-semibold">
                Total CO₂ emitted: {data.co2Tonnes} tonnes
              </p>
              <p className="text-industrial-accent text-2xl font-semibold mt-4">
                Water used / polluted: {data.waterCubicMeters} m³
              </p>
              <p className="text-industrial-ore text-2xl font-semibold mt-4">
                Waste generated: {data.wasteTonnes} tonnes
              </p>
              <p className="text-industrial-success text-xl font-medium mt-6">
                Estimated ecosystem recovery: {data.recoveryYears} years
              </p>
              {(data.equivalents?.waterText || data.equivalents?.carsText) && (
                <p className="text-gray-400 text-base mt-4 max-w-lg mx-auto">
                  {data.equivalents.waterText && <span>{data.equivalents.waterText}. </span>}
                  {data.equivalents.carsText && <span>{data.equivalents.carsText}</span>}
                </p>
              )}
              {shortExplanation && (
                <p className="text-gray-400 text-base mt-4 max-w-lg mx-auto">
                  {shortExplanation}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 transition-colors"
          >
            Restart simulation
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
