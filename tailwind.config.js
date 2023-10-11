/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  daisyui: {
    themes: [{}], //enable only light theme dac0a3
  },
  theme: {
    extend: {
      colors: {
        background: '#f8f0e5',
        window: '#eadbc8',
        text: '#dac0a3',
        accent: '#0f2c59',
      },
      fontFamily: {
        fontspring: ['Fontspring', 'cursive'],
      },
    },
  },
  plugins: [require('daisyui')],
};
