import type { Config } from "tailwindcss";

/**
 * Color helper — wraps a CSS custom property (space-separated RGB channels)
 * so Tailwind's opacity-modifier syntax (e.g. `bg-gold-500/30`) works.
 */
const cv = (name: string) =>
  `rgb(var(--${name}) / <alpha-value>)` as unknown as string;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base — page background & surfaces
        ink: {
          DEFAULT: cv("ink"),
          page: cv("ink-page"),
          surface: cv("ink-surface"),
          raised: cv("ink-raised"),
          border: cv("ink-border"),
        },
        // Primary accent (rose — was gold)
        gold: {
          DEFAULT: cv("gold"),
          50: cv("gold-50"),
          100: cv("gold-100"),
          200: cv("gold-200"),
          300: cv("gold-300"),
          400: cv("gold-400"),
          500: cv("gold-500"),
          600: cv("gold-600"),
          700: cv("gold-700"),
          800: cv("gold-800"),
          900: cv("gold-900"),
        },
        // Secondary accent — warm mocha-taupe
        mocha: {
          DEFAULT: cv("mocha"),
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
          DEFAULT: cv("cream"),
          50: cv("cream-50"),
          100: cv("cream-100"),
          200: cv("cream-200"),
          muted: cv("cream-muted"),
          dim: cv("cream-dim"),
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
        soft: "var(--shadow-soft)",
        gold: "var(--shadow-gold)",
      },
      backgroundImage: {
        "gold-gradient": "var(--gradient-gold)",
        "radial-glow": "var(--radial-glow)",
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
