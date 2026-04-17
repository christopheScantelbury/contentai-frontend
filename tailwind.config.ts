import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── ScantelburyDevs brand tokens ──────────────────
        brand: {
          DEFAULT: '#00D4FF',
          dark:    '#0088CC',
        },
        navy: {
          DEFAULT: '#0A0F1E',
          mid:     '#111827',
          card:    '#141C2F',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
        sans:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
