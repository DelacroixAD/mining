/**
 * Environment Visual - SVG layers: land, water, air
 * Colors and opacity driven by impact (landDamage, waterPollution, airPollution)
 */
import { motion } from 'framer-motion';

export default function EnvironmentVisual({ landDamage = 0, waterPollution = 0, airPollution = 0 }) {
  // Base healthy colors → polluted
  const landColor = `rgb(${120 - landDamage * 80},${Math.round(100 - landDamage * 60)},${60 - landDamage * 40})`;
  const waterColor = `rgb(${40},${Math.round(120 - waterPollution * 80)},${Math.round(140 - waterPollution * 60)})`;
  const smokeOpacity = airPollution * 0.7;

  return (
    <div className="w-full h-full min-h-[280px] rounded-lg overflow-hidden bg-industrial-panel border border-industrial-border">
      <svg
        viewBox="0 0 400 280"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky layer */}
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2332" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
          <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,100,100,0)" />
            <stop offset="100%" stopColor={`rgba(180,180,180,${smokeOpacity})`} />
          </linearGradient>
        </defs>
        <rect width="400" height="280" fill="url(#skyGrad)" />

        {/* Smoke / air pollution */}
        <motion.rect
          width="400"
          height="280"
          fill="url(#smokeGrad)"
          initial={false}
          animate={{ opacity: 0.3 + smokeOpacity * 0.7 }}
          transition={{ duration: 0.5 }}
        />
        {airPollution > 0.2 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ellipse cx="200" cy="80" rx="120" ry="40" fill={`rgba(140,140,140,${smokeOpacity * 0.5})`} />
            <ellipse cx="120" cy="120" rx="80" ry="30" fill={`rgba(120,120,120,${smokeOpacity * 0.4})`} />
            <ellipse cx="280" cy="100" rx="90" ry="35" fill={`rgba(130,130,130,${smokeOpacity * 0.4})`} />
          </motion.g>
        )}

        {/* Water body */}
        <motion.path
          d="M 0 200 Q 100 180 200 190 T 400 185 L 400 280 L 0 280 Z"
          fill={waterColor}
          initial={false}
          animate={{ fill: waterColor }}
          transition={{ duration: 0.5 }}
        />

        {/* Land / terrain */}
        <motion.path
          d="M 0 220 Q 80 200 160 210 T 320 205 T 400 215 L 400 280 L 0 280 Z"
          fill={landColor}
          initial={false}
          animate={{ fill: landColor }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M 0 240 Q 120 220 250 235 T 400 245 L 400 280 L 0 280 Z"
          fill={landColor}
          initial={false}
          animate={{ fill: landColor }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  );
}
