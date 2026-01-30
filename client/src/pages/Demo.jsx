/**
 * Story / Demo Mode – Guided 3-decision flow for judges (2-min demo).
 * "You are the operations head of a mine with 5 years to meet sustainability goals."
 */
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDemoSteps, getDemoOutcome } from '../api';
import DamageScore from '../components/DamageScore';

export default function Demo() {
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [choices, setChoices] = useState({ scenario: null, energySource: null, composite: null });
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDemoSteps()
      .then((res) => setSteps(res.steps || []))
      .catch(() => setSteps([]));
  }, []);

  const step = steps[stepIndex];
  const param = step?.param;
  const value = param ? choices[param] : null;

  const handleChoice = useCallback((choiceValue, choiceData) => {
    if (!param) return;
    setChoices((prev) => ({ ...prev, [param]: choiceValue }));
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [param, stepIndex, steps.length]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDemoOutcome({
        scenario: choices.scenario || 'open-pit',
        energySource: choices.energySource || 'grid',
        composite: choices.composite || 'balanced',
      });
      setOutcome(res);
    } catch (e) {
      console.error(e);
      setOutcome({ message: 'Unable to compute outcome.' });
    } finally {
      setLoading(false);
    }
  }, [choices]);

  const canSubmit = stepIndex === steps.length - 1 && (param ? choices[param] != null : false);

  return (
    <motion.div
      className="min-h-screen bg-industrial-dark px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-industrial-muted hover:text-gray-200">← Back</Link>
          <span className="text-industrial-accent text-sm font-medium">Demo Mode (2 min)</span>
        </div>

        <AnimatePresence mode="wait">
          {!outcome ? (
            <motion.div
              key={`step-${stepIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step && (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-100">{step.title}</h1>
                  <p className="mt-2 text-industrial-muted">{step.prompt}</p>
                  <div className="mt-8 space-y-3">
                    {step.choices.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleChoice(c.value, c)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors ${
                          value === c.value
                            ? 'border-industrial-accent bg-industrial-panel'
                            : 'border-industrial-border bg-industrial-panel/50 hover:border-industrial-muted'
                        }`}
                      >
                        <span className="font-medium text-gray-100">{c.label}</span>
                        {c.impact && (
                          <span className="block text-sm text-industrial-muted mt-1">Impact: {c.impact}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                      className="text-industrial-muted hover:text-gray-200"
                    >
                      Back
                    </button>
                    {canSubmit ? (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400 disabled:opacity-50"
                      >
                        {loading ? 'Calculating…' : 'See outcome'}
                      </button>
                    ) : (
                      <span className="text-industrial-muted text-sm">Choose an option to continue</span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-xl bg-industrial-panel border border-industrial-border"
            >
              <h2 className="text-2xl font-bold text-gray-100">Your outcome</h2>
              <p className="mt-4 text-gray-300">{outcome.message}</p>
              {outcome.damageScore != null && (
                <div className="mt-6">
                  <DamageScore
                    score={outcome.damageScore}
                    band={outcome.damageBand}
                    label={outcome.damageLabel}
                    size="lg"
                  />
                </div>
              )}
              {outcome.recoveryYears != null && (
                <p className="mt-4 text-industrial-muted">Estimated ecosystem recovery: {outcome.recoveryYears} years</p>
              )}
              {outcome.impact && (
                <div className="mt-6 flex flex-wrap gap-4 tabular-nums text-sm">
                  <span className="text-industrial-danger">CO₂: {outcome.impact.co2Tonnes} t</span>
                  <span className="text-industrial-accent">Water: {outcome.impact.waterCubicMeters} m³</span>
                  <span className="text-industrial-ore">Waste: {outcome.impact.wasteTonnes} t</span>
                </div>
              )}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setOutcome(null); setStepIndex(0); setChoices({ scenario: null, energySource: null, composite: null }); }}
                  className="px-6 py-3 rounded-lg border border-industrial-border text-gray-300 hover:bg-industrial-panel"
                >
                  Try again
                </button>
                <Link
                  to="/scenario"
                  className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg hover:bg-blue-400"
                >
                  Full simulation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
