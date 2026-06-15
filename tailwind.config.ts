import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base — deep black / charcoal
        ink: {
          DEFAULT: "#0E0E0F",
          page: "#0E0E0F",
          surface: "#1A1A1C",
          raised: "#222225",
          border: "#2E2E32",
        },
        // Accent — gold + champagne
        gold: {
          DEFAULT: "#C8A24A",
          50: "#FBF6E9",
          100: "#F4E8C6",
          200: "#E6D2A8", // champagne highlight
          300: "#DBC084",
          400: "#D0AE64",
          500: "#C8A24A",
          600: "#A8853A",
          700: "#83682D",
          800: "#5C4920",
          900: "#352A12",
        },
        // Soft tones
        blush: "#F4E7E1",
        sand: "#EAD7C7",
        // WhatsApp — muted utility green (not neon)
        whatsapp: {
          DEFAULT: "#1A9E4C",
          hover: "#178944",
        },
        // Text
        cream: {
          DEFAULT: "#F5F2EC",
          50: "#FBFAF7",
          100: "#F5F2EC",
          200: "#E8E2D6",
          muted: "#B7B2A8",
          dim: "#8A857C",
        },
      },
      fontFamily: {
        // Latin display / body
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Tamil display / body
        "ta-display": ["var(--font-tamil-display)", "Latha", "serif"],
        "ta-sans": ["var(--font-tamil-sans)", "Latha", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      spacing: {
        section: "clamp(2.5rem, 5vw, 4.5rem)",
        gutter: "clamp(1rem, 4vw, 2rem)",
      },
      maxWidth: {
        content: "80rem",
      },
      boxShadow: {
        soft: "0 4px 30px rgba(0, 0, 0, 0.25)",
        gold: "0 10px 40px rgba(200, 162, 74, 0.18)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E6D2A8 0%, #C8A24A 50%, #A8853A 100%)",
        "radial-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(200,162,74,0.18) 0%, rgba(14,14,15,0) 70%)",
      },
      letterSpacing: {
        luxe: "0.22em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
