import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#060810",
        surface: "#0d1120",
        "surface-light": "#151a2d",
        border: "#1e2540",
        "text-primary": "#f0f2f5",
        "text-secondary": "#8b95a5",
        accent: "#00e5ff",
        cyan: "#00e5ff",
        "product-1": "#00e5ff",
        "product-2": "#a78bfa",
        "product-3": "#10b981",
        "product-4": "#f59e0b",
        "product-5": "#fb7185",
      },
      fontFamily: {
        heading: ["var(--font-unbounded)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "30px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 229, 255, 0.06)",
        "card-hover": "0 8px 40px rgba(0, 229, 255, 0.12)",
        glow: "0 0 20px rgba(0, 229, 255, 0.15)",
        "glow-lg": "0 0 40px rgba(0, 229, 255, 0.2)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
