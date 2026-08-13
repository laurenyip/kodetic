import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        red: "#E8281A",
        purple: "#6B3FA0",
        ash: "#1a181c",
        mist: "#2a262e",
        violet: {
          shadow: "#1c1424",
          glow: "#3a2a4a",
        },
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Zodiak",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Red Hat Display",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      transitionDuration: {
        hover: "200ms",
        panel: "350ms",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      backgroundImage: {
        canvas:
          "radial-gradient(ellipse at 20% 0%, rgba(58,42,74,0.35), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(28,20,36,0.55), transparent 50%), linear-gradient(180deg, #050505 0%, #0a090c 40%, #08070a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
