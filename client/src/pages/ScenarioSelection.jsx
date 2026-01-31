/**
 * Scenario Selection - 3 cards: Open-pit, Underground, Smelting & refining
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SCENARIOS = [
  {
    id: "open-pit",
    title: "Open-pit mining",
    description: "Surface extraction with visible land disruption and runoff.",
    icon: "⛏️",
    gradient: "from-amber-500/20 to-orange-500/20",
    borderGradient: "from-amber-500/40 to-orange-500/40",
    hoverGradient: "from-amber-500/30 to-orange-500/30",
  },
  {
    id: "underground",
    title: "Underground mining",
    description:
      "Shaft and tunnel operations with groundwater and subsidence risks.",
    icon: "🕳️",
    gradient: "from-slate-500/20 to-gray-500/20",
    borderGradient: "from-slate-500/40 to-gray-500/40",
    hoverGradient: "from-slate-500/30 to-gray-500/30",
  },
  {
    id: "smelting",
    title: "Smelting & refining",
    description: "High-temperature processing, emissions, and slag waste.",
    icon: "🔥",
    gradient: "from-red-500/20 to-orange-500/20",
    borderGradient: "from-red-500/40 to-orange-500/40",
    hoverGradient: "from-red-500/30 to-orange-500/30",
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
    navigate("/simulator");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background effects */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
            <span className="text-sm text-blue-300 font-semibold">
              Step 1 of 5
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-4">
            Choose Your Scenario
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Each industrial path has unique environmental tradeoffs. Select one
            to begin your analysis.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {SCENARIOS.map((s, i) => {
            const isSelected = selected === s.id;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s.id)}
                className={`group relative text-left p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${s.gradient} border-transparent shadow-2xl shadow-blue-500/30`
                      : "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30"
                  }`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient border overlay for selected */}
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${s.borderGradient} opacity-50 rounded-2xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl`}
                />

                <div className="relative z-10">
                  {/* Icon with animation */}
                  <motion.div
                    className="text-6xl mb-6"
                    animate={
                      isSelected
                        ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {s.icon}
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {s.title}
                  </h2>

                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {s.description}
                  </p>

                  {/* Selection indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-blue-400 bg-blue-500"
                          : "border-gray-600"
                      }`}
                    >
                      {isSelected && (
                        <motion.svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isSelected ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select this scenario"}
                    </span>
                  </div>
                </div>

                {/* Animated corner accent */}
                {isSelected && (
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-transparent rounded-bl-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          className="mt-16 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <motion.button
            onClick={handleContinue}
            disabled={!selected}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-lg text-white
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700
                       hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/30
                       hover:shadow-2xl hover:shadow-blue-500/50 disabled:shadow-none
                       flex items-center gap-3"
            whileHover={selected ? { scale: 1.05 } : {}}
            whileTap={selected ? { scale: 0.95 } : {}}
            style={{ transition: "transform 0.1s ease-out" }}
            onMouseMove={(e) => {
              if (!selected) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            <span>Continue to Simulator</span>
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
