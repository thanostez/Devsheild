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
        primaryBg: "#0A0E1A",
        secondaryBg: "#0F1629",
        surface: "#1A2035",
        border: "#1E2D4A",
        accentBlue: "#3B82F6",
        accentCyan: "#06B6D4",
        accentPurple: "#8B5CF6",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        critical: "#DC2626",
        textPrimary: "#F1F5F9",
        textSecondary: "#94A3B8",
        textDim: "#475569",
      },
      fontFamily: {
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
