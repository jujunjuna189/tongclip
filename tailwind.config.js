/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#dfc6ff',
          500: '#886bff',
          600: '#7551e9',
          700: '#6139d2',
          800: '#532bb9',
          900: '#46239f',
          950: '#2b106c',
        },
        bluebrand: '#886bff',
        blueglow: '#dfc6ff',
        night: '#050505',
        panel: '#101010',
        line: '#242424',
      },
      boxShadow: {
        blue: '0 0 36px rgba(136,107,255,.52)',
        card: '0 24px 80px rgba(0,0,0,.42)',
      },
    },
  },
  plugins: [],
}
