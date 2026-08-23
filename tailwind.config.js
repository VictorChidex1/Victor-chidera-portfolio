/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "Inter", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        brand: {
          ink: "#111111", // Near-black: headings & primary buttons
          muted: "#666666", // Secondary text
          bg: "#FFFFFF", // Main background
          surface: "#F7F7F5", // Secondary section background
          line: "#E7E5E4", // Thin borders
          accent: "#F97316", // Micro brand details only
        },
      },
    },
  },
  plugins: [],
};
