import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1c0808',
          card: '#111111',
          border: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.03em',
      },
      lineHeight: {
        relaxed: '1.7',
      },
    },
  },
  plugins: [],
}

export default config
