/**
 * Demo Mode - Empty placeholder
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Demo() {
  return (
    <motion.div
      className="min-h-screen bg-industrial-dark px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-industrial-muted hover:text-gray-200">← Back</Link>
      </div>
    </motion.div>
  );
}

