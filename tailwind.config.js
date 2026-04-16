/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#b8960c',
          light: '#d4a017',
          dim: 'rgba(184,150,12,0.15)',
        },
        dark: {
          DEFAULT: '#111010',
          2: '#1a1a1a',
          3: '#222',
        },
        cream: '#f5f0ea',
        text: {
          DEFAULT: '#c8c4bc',
          dim: 'rgba(200,196,188,0.5)',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
