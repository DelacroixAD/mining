/**
 * Animates numeric value changes (e.g. CO2, water, waste)
 */
import { motion } from 'framer-motion';

export default function AnimatedNumber({ value, suffix = '', className = '' }) {
  return (
    <motion.span
      className={`tabular-nums ${className}`}
      animate={{ opacity: 1 }}
      key={value}
      initial={{ scale: 1.15, opacity: 0.8 }}
      transition={{ duration: 0.35 }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}
