/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#8AA2A0",
          secondary: "#a28a8c",
          accent: "#D6A495",
          neutral: "#E7E1DB",
          "base-100": "F4EFF4",
          info: "#7b93b0",
          success: "#728e7e",
          warning: "#b0987b",
          error: "#b07b93",
        },
      },
      "light",
      "retro",
      "cupcake",
      "dark",
    ],
  },
};
