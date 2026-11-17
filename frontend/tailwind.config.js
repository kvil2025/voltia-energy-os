/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060709',
          900: '#0b0d12',
          850: '#10141d',
          800: '#141924',
          700: '#1e2535',
        },
        voltia: {
          cyan: '#00e5ff',
          gold: '#eab308',
          amber: '#f59e0b',
          emerald: '#10b981',
          crimson: '#f43f5e',
          violet: '#3b82f6',
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "system-ui",
          "sans-serif"
        ],
        mono: [
          "SF Mono",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Cascadia Mono",
          "Segoe UI Mono",
          "monospace"
        ]
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.025em',
        tight: '-0.015em',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'cyan-glow': '0 0 25px -4px rgba(0, 229, 255, 0.35)',
        'gold-glow': '0 0 25px -4px rgba(234, 179, 8, 0.35)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
