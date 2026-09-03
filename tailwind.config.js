/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bluebrand: '#1F6BFF',
        blueglow: '#70B9FF',
        night: '#050505',
        panel: '#101010',
        line: '#242424',
      },
      boxShadow: {
        blue: '0 0 36px rgba(31,107,255,.52)',
        card: '0 24px 80px rgba(0,0,0,.42)',
      },
    },
  },
  plugins: [],
}
