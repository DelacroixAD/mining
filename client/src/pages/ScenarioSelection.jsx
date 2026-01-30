/**
 * Scenario Selection - 3 cards: Open-pit, Underground, Smelting & refining
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SCENARIOS = [
  {
    id: 'open-pit',
    title: 'Open-pit mining',
    description: 'Surface extraction with visible land disruption and runoff.',
    icon: '⛏️',
  },
  {
    id: 'underground',
    title: 'Underground mining',
    description: 'Shaft and tunnel operations with groundwater and subsidence risks.',
    icon: '🕳️',
  },
  {
    id: 'smelting',
    title: 'Smelting & refining',
    description: 'High-temperature processing, emissions, and slag waste.',
    icon: '🔥',
  },
];

export default function ScenarioSelection({ simState, updateSimState }) {
  const [selected, setSelected] = useState(simState.scenario);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelected(id);
    updateSimState({ scenario: id });
  };

  const handleContinue = () => {
    if (!selected) return;
    updateSimState({ scenario: selected });
    navigate('/simulator');
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
          transition={{ delay: 0.1 }}
        >
          Choose a scenario
        </motion.h1>
        <motion.p
          className="mt-2 text-industrial-muted"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Each path has different environmental tradeoffs.
        </motion.p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s.id)}
              className={`text-left p-6 rounded-xl border-2 transition-colors ${
                selected === s.id
                  ? 'border-industrial-accent bg-industrial-panel'
                  : 'border-industrial-border bg-industrial-panel/50 hover:border-industrial-muted'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-3xl">{s.icon}</span>
              <h2 className="mt-3 text-xl font-semibold text-gray-100">{s.title}</h2>
              <p className="mt-2 text-sm text-industrial-muted">{s.description}</p>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="text-industrial-muted hover:text-gray-200 transition-colors"
          >
            ← Back
          </Link>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="px-6 py-3 bg-industrial-accent text-industrial-dark font-semibold rounded-lg
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-400 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
