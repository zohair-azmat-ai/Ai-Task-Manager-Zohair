import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        bg: {
          primary: "#07070f",
          secondary: "#0e0e1a",
          card: "#12121f",
          hover: "#1a1a2e",
          border: "#1e1e35",
        },
        accent: {
          primary: "#6366f1",    // indigo
          secondary: "#8b5cf6",  // violet
          success: "#10b981",    // emerald
          warning: "#f59e0b",    // amber
          danger: "#ef4444",     // red
          info: "#3b82f6",       // blue
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#475569",
          inverse: "#07070f",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #07070f 0%, #0e0e1a 50%, #12121f 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.02) 100%)",
        "accent-gradient": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.24)",
        "card-hover": "0 4px 20px rgba(99,102,241,0.15), 0 2px 8px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
