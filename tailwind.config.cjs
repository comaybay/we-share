const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['sans-serif', ...defaultTheme.fontFamily.sans],
      },
      transitionDuration: {
        '25': '25ms',
        '50': '50ms'
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: "#000000",
      'paper': '#FEFFFF',
      'pri-base': '#32667C',
      'pri-light': '#6493A7',
      'pri-lighter': '#EEF5F8',
      'pri-hover': '#4693cf',
      'sec-base': '#b83232',
      'sec-hover': '#942323',
      'sec-loading': '#b56662',
      'tert-base': '#1512AD',
      'tert-light': '#D7D6FC',
      'qua-base': '#1AA75B',
      'qua-hover': '#942323',
      'qua-loading': '#63d498',
      'quin-base': '#D4D838',
      'quin-hover': '#afb327',
      'quin-loading': '#e1e38a',
    },

  },
  plugins: [require('@tailwindcss/line-clamp')],
}
