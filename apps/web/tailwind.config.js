/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        ink: {
          950: "#1a1612",
          900: "#241f19",
          700: "#4a433a",
          500: "#7a7268",
        },
        paper: {
          50: "#fbf7f0",
          100: "#f3ece1",
          200: "#e6d9c6",
        },
        pine: {
          600: "#2f6f5e",
          700: "#245748",
          800: "#1b4236",
        },
        clay: {
          500: "#c0562a",
          600: "#a94620",
        },
      },
      boxShadow: {
        card: "0 18px 40px -28px rgba(36, 31, 25, 0.45)",
      },
    },
  },
  plugins: [],
};
