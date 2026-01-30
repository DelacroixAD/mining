/**
 * Environmental Damage Score (0–100) with color band: green / yellow / red
 */
import { motion } from 'framer-motion';

const BAND_CLASSES = {
  green: 'bg-industrial-success/20 text-industrial-success border-industrial-success/40',
  yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  red: 'bg-industrial-danger/20 text-industrial-danger border-industrial-danger/40',
};

export default function DamageScore({ score = 0, band = 'green', label = 'Low damage', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'text-sm px-2 py-0.5' : size === 'lg' ? 'text-xl px-4 py-2' : 'text-base px-3 py-1';
  const bandClass = BAND_CLASSES[band] || BAND_CLASSES.green;

  return (
    <motion.div
      className={`inline-flex items-center gap-2 rounded-lg border font-semibold tabular-nums ${sizeClass} ${bandClass}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      key={`${score}-${band}`}
    >
      <span>Damage: {score}</span>
      <span className="opacity-90 font-normal">({label})</span>
    </motion.div>
  );
}
