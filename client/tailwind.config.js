/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: '#0d1117',
          panel: '#161b22',
          border: '#30363d',
          muted: '#8b949e',
          accent: '#58a6ff',
          danger: '#f85149',
          success: '#3fb950',
          ore: '#6e4c2e',
          polluted: '#2d5a4a',
        },
      },
      fontFamily: {
        sans: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
