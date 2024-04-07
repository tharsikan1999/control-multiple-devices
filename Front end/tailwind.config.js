/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        mycolor: "#7F63F4",
        customPurple: "#F7F7FC",
        customGreen: "rgb(113, 216, 117)",
      },
    },
  },
  plugins: [],
};
