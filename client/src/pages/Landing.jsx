/**
 * Landing Page - Dark industrial theme, headline, Start Simulation CTA
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-industrial-dark relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#58a6ff 1px, transparent 1px),
                            linear-gradient(90deg, #58a6ff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center text-gray-100 max-w-4xl relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Every industrial decision has a{" "}
        <span className="text-industrial-accent">long-term</span> impact.
      </motion.h1>

      <motion.p
        className="mt-6 text-lg md:text-xl text-industrial-muted max-w-2xl text-center relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Explore how mining and metallurgy choices affect land, water, and air—in
        real time.
      </motion.p>

      <motion.div
        className="mt-12 relative z-10 flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link
          to="/scenario"
          className="inline-flex items-center gap-2 px-8 py-4 bg-industrial-accent text-industrial-dark font-semibold rounded-lg
                     hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-industrial-accent focus:ring-offset-2 focus:ring-offset-industrial-dark"
        >
          Start Simulation
        </Link>
      </motion.div>
    </motion.div>
  );
}
