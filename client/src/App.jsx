/**
 * Main app: routing and global simulation state
 */
import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useCursorPull } from './hooks/useCursorPull';

import Landing from './pages/Landing';
import ScenarioSelection from './pages/ScenarioSelection';
import DecisionSimulator from './pages/DecisionSimulator';
import Tradeoff from './pages/Tradeoff';
import Timeline from './pages/Timeline';
import Comparison from './pages/Comparison';
import Summary from './pages/Summary';
import Demo from './pages/Demo';

// Shared simulation state (no Redux)
const defaultSimState = {
  scenario: null,
  oreQuality: 50,
  processingSpeed: 50,
  energySource: 'grid',
  impact: null,
  tradeoffLevel: 0.5,
  timelineYears: 0,
  finalImpact: null,
};

export default function App() {
  const [simState, setSimState] = useState(defaultSimState);
  useCursorPull(8); // Enable cursor-pull effect globally

  const updateSimState = useCallback((updates) => {
    setSimState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSimulation = useCallback(() => {
    setSimState(defaultSimState);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route
          path="/scenario"
          element={
            <ScenarioSelection simState={simState} updateSimState={updateSimState} />
          }
        />
        <Route
          path="/simulator"
          element={
            <DecisionSimulator simState={simState} updateSimState={updateSimState} />
          }
        />
        <Route
          path="/tradeoff"
          element={
            <Tradeoff simState={simState} updateSimState={updateSimState} />
          }
        />
        <Route
          path="/timeline"
          element={
            <Timeline simState={simState} updateSimState={updateSimState} />
          }
        />
        <Route
          path="/comparison"
          element={
            <Comparison simState={simState} updateSimState={updateSimState} />
          }
        />
        <Route
          path="/summary"
          element={
            <Summary
              simState={simState}
              updateSimState={updateSimState}
              resetSimulation={resetSimulation}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
