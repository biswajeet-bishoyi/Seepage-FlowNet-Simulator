/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          blue: "#1E90FF",
          cyan: "#00B4D8",
          dark: "#0F4C81",
        },
        equi: {
          teal: "#20B2AA",
          light: "#48D1CC",
        },
        dam: {
          body: "#374151",
          border: "#1F2937",
          pattern: "#4B5563",
        },
        soil: {
          base: "#E2BA87",
          dark: "#C69B67",
          light: "#F7E6D0",
        },
        water: {
          shallow: "#BAE6FD",
          deep: "#38BDF8",
          surface: "#0284C7",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
