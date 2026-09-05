import type { Config } from "tailwindcss";

// Design tokens are exposed as CSS custom properties in app/globals.css so a
// firm can rebrand (different accent colour, different fonts) by editing one
// block of CSS variables instead of hunting through components.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        slate: "var(--color-slate)",
        line: "var(--color-line)",
        brass: "var(--color-brass)",
        "brass-deep": "var(--color-brass-deep)",
        surface: "var(--color-surface)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        none: "none",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "3px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
