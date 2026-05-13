import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial × Quiet Luxury palette
        paper:     "#FAF6EE",   // Cream-Hintergrund (warmes Papier)
        paper2:    "#F2EBDD",   // tieferes Papier (Cards, Insets)
        ink:       "#161616",   // Off-Black für Text
        ink2:      "#3A3735",   // sekundärer Text
        ink3:      "#7D7872",   // tertiärer Text
        rule:      "#C9C1B0",   // Hairline-Dividers
        burgundy:  "#6B2737",   // Editorial-Akzent (statt Teal)
        burgundy2: "#8B3A4A",   // Hover-Variante
        gold:      "#B8945F",   // Premium-Highlight (statt Amber)
        gold2:     "#D4B27C",   // Soft-Gold
        sage:      "#7A8471",   // tertiärer ruhiger Akzent
        bottle:    "#1B3A2F",   // tiefes Hospitality-Grün (für Pitch-Cover)
      },
      fontFamily: {
        // Geladen über next/font in layout.tsx
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 7rem)",  { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.8rem, 6vw, 5rem)",  { lineHeight: "1.0",  letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2.2rem, 4.5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.6rem, 3vw, 2.4rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      animation: {
        reveal: "reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        rise:   "rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) both",
        fade:   "fade 1.2s ease-out both",
        scrollLine: "scrollLine 1.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        reveal: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          "0%":   { opacity: "0", transform: "translateY(60px)", letterSpacing: "0" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scrollLine: {
          "0%":   { transform: "scaleY(0)", transformOrigin: "top" },
          "100%": { transform: "scaleY(1)", transformOrigin: "top" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
