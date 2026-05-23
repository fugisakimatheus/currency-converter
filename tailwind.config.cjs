/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,jsx}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        indigo: {
          950: "#1e1b4b",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
