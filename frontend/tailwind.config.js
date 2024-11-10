/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6363",
        secondary: {
          secondary: "#888883",
        },
      },
    },
  },
  plugins: [],
}