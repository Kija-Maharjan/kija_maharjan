/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#3A2942',
          light: '#4A3952',
          lighter: '#5A4962',
          dim: 'rgba(58,41,66,0.6)',
        },
        pearl: '#F4E7FB',
        blush: '#F2DDDC',
        rose: '#F6BCBA',
        mauve: '#E3AADD',
        orchid: '#C8A8E9',
        lavender: {
          DEFAULT: '#C3C7F4',
          dim: 'rgba(195,199,244,0.15)',
          lighter: 'rgba(195,199,244,0.25)',
        },
        text: {
          DEFAULT: '#E3AADD',
          dim: 'rgba(227,170,221,0.5)',
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
