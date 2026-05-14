/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#fdfcf8",
          100: "#faf7f0",
          200: "#f5f0e4",
          300: "#ede4d0",
        },
        ink: {
          light: "#6b6659",
          DEFAULT: "#3d3a32",
          dark: "#1a1916",
        },
      },
    },
  },
  plugins: [],
};
