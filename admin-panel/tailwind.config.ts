import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D9A2E',
          light: '#5DBF3F',
          dark: '#236E16',
        },
        secondary: {
          DEFAULT: '#F5A800',
          dark: '#C88700',
        },
        danger: {
          DEFAULT: '#D32F2F',
          light: '#E57373',
        },
        bg: {
          base: '#0D0D0D',
          surface: '#1A1A1A',
          elevated: '#242424',
        },
        border: {
          DEFAULT: '#2E2E2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
