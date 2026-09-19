import type { Config } from 'tailwindcss';

/**
 * Tailwind reads the CSS variables produced from config/brand.ts,
 * so colours are never duplicated between the two files.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        abyss: 'var(--abyss)',
        slate: 'var(--slate)',
        aqua: 'var(--aqua)',
        tide: 'var(--tide)',
        sand: 'var(--sand)',
        lilac: 'var(--lilac)',
        cream: 'var(--cream)',
        mist: 'var(--mist)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      // A calm, unhurried motion curve used across the whole site.
      transitionTimingFunction: {
        breath: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
