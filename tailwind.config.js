/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: [], //enable only light theme
  },
  theme: {
    extend: {
      fontFamily: {
        fontspring: ["Fontspring", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
};
