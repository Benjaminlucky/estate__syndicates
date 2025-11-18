/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Add Flowbite's path
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        golden: {
          50: "#FAF4ED",
          100: "#F1E2D0",
          200: "#DEC0A3",
          300: "#C99E75",
          400: "#B37D49",
          500: "#94662A",
          600: "#785223",
          700: "#5D3F1C",
          800: "#422C15",
          900: "#28190C",
        },
        black: {
          50: "#f5f5f5",
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#A3A3A3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#000000",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        chivo: ["Chivo", "sans-serif"],
        cinzel: ["Cinzel", "sans-serif"],
      },
      screens: {
        watch: "162px", // 👈 Apple Watch Series 6 (small screen)
        iphone5s: "320px",
        iPhone12Pro: "390px",
        iPhone12ProMax: "428px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("flowbite/plugin"), // Add Flowbite plugin
  ],
};
