/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          // primary: "#dac0a3",
          // secondary: "#eadbc8",
          // accent: "#0f2c59",
          // neutral: "#faf0e5",
        },
      },
    ], //enable only light theme dac0a3
  },
  theme: {
    // colors: {
    //   background: "#f8f0e5",
    //   window: "#eadbc8",
    //   text: "#dac0a3",
    //   accent: "#0f2c59",
    // },
    extend: {
      fontFamily: {
        fontspring: ["Fontspring", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
};
