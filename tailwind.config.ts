import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "th-bg":     "var(--bg-primary)",
        "th-soft":   "var(--bg-secondary)",
        "th-ink":    "var(--text-primary)",
        "th-muted":  "var(--text-muted)",
        "th-border": "var(--border)",
        "th-card":   "var(--card-bg)",
        "th-accent": "var(--accent)",
        "th-accent2": "var(--accent2)",
        "th-accent3": "var(--accent3)",
        "th-badge-bg": "var(--badge-bg)",
        "th-badge":  "var(--badge-text)",
      },
    },
  },
  plugins: [],
};

export default config;
