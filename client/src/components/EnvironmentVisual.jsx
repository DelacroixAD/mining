/**
 * Environment Visual - SVG layers: land, water, air
 * Colors and opacity driven by impact (landDamage, waterPollution, airPollution)
 */
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function EnvironmentVisual({
  landDamage = 0,
  waterPollution = 0,
  airPollution = 0,
}) {
  // Enhanced color transitions from healthy to polluted
  const landColor = useMemo(() => {
    const healthyGreen = { r: 76, g: 175, b: 80 };
    const pollutedBrown = { r: 101, g: 67, b: 33 };
    return `rgb(${Math.round(healthyGreen.r + (pollutedBrown.r - healthyGreen.r) * landDamage)},${Math.round(healthyGreen.g + (pollutedBrown.g - healthyGreen.g) * landDamage)},${Math.round(healthyGreen.b + (pollutedBrown.b - healthyGreen.b) * landDamage)})`;
  }, [landDamage]);

  const waterColor = useMemo(() => {
    const healthyBlue = { r: 33, g: 150, b: 243 };
    const pollutedGray = { r: 96, g: 125, b: 139 };
    return `rgb(${Math.round(healthyBlue.r + (pollutedGray.r - healthyBlue.r) * waterPollution)},${Math.round(healthyBlue.g + (pollutedGray.g - healthyBlue.g) * waterPollution)},${Math.round(healthyBlue.b + (pollutedGray.b - healthyBlue.b) * waterPollution)})`;
  }, [waterPollution]);

  const smokeOpacity = airPollution * 0.8;
  const smokeParticles = Math.floor(airPollution * 15);

  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-white/10 shadow-2xl">
      <svg
        viewBox="0 0 500 350"
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Enhanced gradients */}
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <motion.stop
              offset="0%"
              stopColor={airPollution > 0.5 ? "#3a3a3a" : "#1a3a52"}
              animate={{
                stopColor: airPollution > 0.5 ? "#3a3a3a" : "#1a3a52",
              }}
              transition={{ duration: 1 }}
            />
            <motion.stop
              offset="100%"
              stopColor={airPollution > 0.3 ? "#1a1a1a" : "#0d1a2e"}
              animate={{
                stopColor: airPollution > 0.3 ? "#1a1a1a" : "#0d1a2e",
              }}
              transition={{ duration: 1 }}
            />
          </linearGradient>

          <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(120,120,120,0)" />
            <stop
              offset="50%"
              stopColor={`rgba(160,160,160,${smokeOpacity * 0.4})`}
            />
            <stop
              offset="100%"
              stopColor={`rgba(200,200,200,${smokeOpacity})`}
            />
          </linearGradient>

          <radialGradient id="sunGrad">
            <stop
              offset="0%"
              stopColor={airPollution > 0.6 ? "#ff6b35" : "#ffd700"}
            />
            <stop
              offset="100%"
              stopColor={airPollution > 0.6 ? "#ff4500" : "#ffa500"}
            />
          </radialGradient>

          {/* Animated water reflection */}
          <linearGradient id="waterReflect" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={waterColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={waterColor} stopOpacity="1" />
            <stop offset="100%" stopColor={waterColor} stopOpacity="0.8" />
          </linearGradient>

          {/* Filter for pollution haze */}
          <filter id="blur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={airPollution * 3}
            />
          </filter>
        </defs>

        {/* Animated sky background */}
        <motion.rect
          width="500"
          height="350"
          fill="url(#skyGrad)"
          animate={{ opacity: 1 - airPollution * 0.3 }}
          transition={{ duration: 1 }}
        />

        {/* Sun/Moon with pollution dimming */}
        <motion.g
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 - airPollution * 0.7 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <circle
            cx="420"
            cy="60"
            r="30"
            fill="url(#sunGrad)"
            opacity={0.9 - airPollution * 0.5}
          />
          <motion.circle
            cx="420"
            cy="60"
            r="35"
            fill="url(#sunGrad)"
            opacity={0.3}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.g>

        {/* Flying birds (only when air is clean) */}
        {airPollution < 0.3 && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d="M 0 0 Q -8 -4 -15 0 M 0 0 Q 8 -4 15 0"
                stroke="#ffffff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ x: -50, y: 80 + i * 20, opacity: 0 }}
                animate={{
                  x: 550,
                  y: [80 + i * 20, 70 + i * 20, 80 + i * 20],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: 12 + i * 2,
                  repeat: Infinity,
                  delay: i * 3,
                  y: { duration: 2, repeat: Infinity },
                }}
              />
            ))}
          </>
        )}

        {/* Animated smoke pollution particles */}
        {airPollution > 0.1 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {Array.from({ length: smokeParticles }).map((_, i) => (
              <motion.circle
                key={i}
                cx={50 + ((i * 30) % 450)}
                cy={60 + ((i * 15) % 100)}
                r={3 + Math.random() * 5}
                fill={`rgba(140,140,140,${0.2 + Math.random() * 0.4})`}
                filter="url(#blur)"
                initial={{ y: 150, opacity: 0 }}
                animate={{
                  y: [150, 30 + Math.random() * 50, 20],
                  x: [
                    50 + ((i * 30) % 450),
                    50 + ((i * 30) % 450) + (Math.random() - 0.5) * 40,
                  ],
                  opacity: [0, smokeOpacity * 0.6, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.g>
        )}

        {/* Mountains/hills in background with depth */}
        <motion.path
          d="M 0 180 Q 100 140 200 160 T 400 145 T 500 155 L 500 350 L 0 350 Z"
          fill={`rgba(60, 60, 80, ${0.4 - airPollution * 0.2})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 - airPollution * 0.2 }}
          transition={{ duration: 1 }}
        />

        {/* Industrial structures (smokestacks) */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <rect x="340" y="160" width="25" height="80" fill="#2a2a2a" />
          <rect x="330" y="150" width="45" height="15" fill="#3a3a3a" />
          <rect x="400" y="170" width="20" height="70" fill="#2a2a2a" />
          <rect x="392" y="160" width="36" height="12" fill="#3a3a3a" />

          {/* Smoke from stacks */}
          {airPollution > 0 && (
            <>
              <motion.ellipse
                cx="352"
                cy="145"
                rx="12"
                ry="8"
                fill={`rgba(150,150,150,${smokeOpacity})`}
                animate={{
                  cy: [145, 130, 120],
                  rx: [12, 18, 24],
                  ry: [8, 12, 16],
                  opacity: [smokeOpacity, smokeOpacity * 0.6, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.ellipse
                cx="410"
                cy="155"
                rx="10"
                ry="7"
                fill={`rgba(150,150,150,${smokeOpacity})`}
                animate={{
                  cy: [155, 140, 130],
                  rx: [10, 16, 22],
                  ry: [7, 10, 14],
                  opacity: [smokeOpacity, smokeOpacity * 0.6, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </motion.g>

        {/* Animated water body with waves */}
        <motion.path
          d="M 0 240 Q 125 225 250 235 T 500 230 L 500 350 L 0 350 Z"
          fill="url(#waterReflect)"
          initial={false}
          animate={{
            d: [
              "M 0 240 Q 125 225 250 235 T 500 230 L 500 350 L 0 350 Z",
              "M 0 242 Q 125 227 250 237 T 500 232 L 500 350 L 0 350 Z",
              "M 0 240 Q 125 225 250 235 T 500 230 L 500 350 L 0 350 Z",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Water surface highlights */}
        {waterPollution < 0.5 && (
          <motion.g opacity={0.6 - waterPollution}>
            <motion.ellipse
              cx="150"
              cy="245"
              rx="40"
              ry="8"
              fill="rgba(255,255,255,0.2)"
              animate={{
                cx: [150, 160, 150],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.ellipse
              cx="350"
              cy="242"
              rx="50"
              ry="10"
              fill="rgba(255,255,255,0.15)"
              animate={{
                cx: [350, 340, 350],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </motion.g>
        )}

        {/* Foreground land with texture */}
        <motion.path
          d="M 0 270 Q 100 255 200 265 T 400 260 T 500 270 L 500 350 L 0 350 Z"
          fill={landColor}
          initial={false}
          animate={{ fill: landColor }}
          transition={{ duration: 1 }}
        />

        <motion.path
          d="M 0 290 Q 150 275 300 285 T 500 290 L 500 350 L 0 350 Z"
          fill={landColor}
          style={{ filter: "brightness(0.8)" }}
          initial={false}
          animate={{ fill: landColor }}
          transition={{ duration: 1 }}
        />

        {/* Vegetation (trees/plants) - fewer when land is damaged */}
        {landDamage < 0.7 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1 - landDamage * 0.8, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Trees */}
            {[0, 1, 2, 3].map((i) => (
              <motion.g key={i}>
                <rect
                  x={80 + i * 90}
                  y={270 - i * 5}
                  width="8"
                  height="25"
                  fill="#4a3c28"
                />
                <motion.polygon
                  points={`${84 + i * 90},${270 - i * 5} ${74 + i * 90},${285 - i * 5} ${94 + i * 90},${285 - i * 5}`}
                  fill={`rgb(${76 - landDamage * 40}, ${175 - landDamage * 100}, ${80 - landDamage * 40})`}
                  animate={{
                    points: [
                      `${84 + i * 90},${270 - i * 5} ${74 + i * 90},${285 - i * 5} ${94 + i * 90},${285 - i * 5}`,
                      `${84 + i * 90},${268 - i * 5} ${72 + i * 90},${285 - i * 5} ${96 + i * 90},${285 - i * 5}`,
                      `${84 + i * 90},${270 - i * 5} ${74 + i * 90},${285 - i * 5} ${94 + i * 90},${285 - i * 5}`,
                    ],
                  }}
                  transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* Pollution indicators on land */}
        {landDamage > 0.5 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: landDamage - 0.3 }}
            transition={{ duration: 1 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={50 + i * 90}
                cy={285 + (i % 2) * 10}
                r={4 + Math.random() * 3}
                fill="#3a3a3a"
                opacity={0.6}
              />
            ))}
          </motion.g>
        )}
      </svg>
    </div>
  );
}
