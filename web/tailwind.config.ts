import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#ffcb05',
          dark: '#161616',
        },
      },
      boxShadow: {
        card: '0 12px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
