/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        golden: {
          50: "#FAF4ED", // Lightest
          100: "#F1E2D0",
          200: "#DEC0A3",
          300: "#C99E75",
          400: "#B37D49",
          500: "#94662A", // Base Color
          600: "#785223",
          700: "#5D3F1C",
          800: "#422C15",
          900: "#28190C", // Darkest Color
        },
        black: {
          50: "#f5f5f5", // Lightest Gray
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#A3A3A3",
          400: "#737373",
          500: "#525252", // Mid-gray
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#000000", // Pure black
        },
      },
      fontFamily: {
        chivo: ["Chivo", "sans-serif"], //Define the "Chivo" font with fallback
        cinzel: ["Cinzel", "sans-serif"], //Define the "Cinzel" font with fallback
      },
    },
  },
  plugins: [],
};
