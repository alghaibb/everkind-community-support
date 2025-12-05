import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Enhanced breakpoints for all device types
    screens: {
      xs: "375px", // Small phones
      sm: "640px", // Large phones
      md: "768px", // Tablets portrait
      lg: "1024px", // Tablets landscape / Small laptops
      xl: "1280px", // Laptops
      "2xl": "1536px", // Large laptops / Monitors
      "3xl": "1920px", // Wide monitors
      "4xl": "2560px", // Ultra-wide monitors
      // Device-specific breakpoints
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      widescreen: "1920px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
        "3xl": "5rem",
      },
      screens: {
        xs: "100%",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1600px",
      },
    },
    extend: {
      // Fluid typography system
      fontSize: {
        xs: ["clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)", { lineHeight: "1.5" }],
        sm: ["clamp(0.875rem, 0.8rem + 0.3vw, 1rem)", { lineHeight: "1.5" }],
        base: ["clamp(1rem, 0.95rem + 0.25vw, 1.125rem)", { lineHeight: "1.6" }],
        lg: ["clamp(1.125rem, 1rem + 0.5vw, 1.25rem)", { lineHeight: "1.5" }],
        xl: ["clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)", { lineHeight: "1.4" }],
        "2xl": ["clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)", { lineHeight: "1.3" }],
        "3xl": ["clamp(1.875rem, 1.6rem + 1.2vw, 2.25rem)", { lineHeight: "1.2" }],
        "4xl": ["clamp(2.25rem, 2rem + 1.5vw, 3rem)", { lineHeight: "1.1" }],
        "5xl": ["clamp(3rem, 2.5rem + 2vw, 3.75rem)", { lineHeight: "1" }],
      },
      // Fluid spacing
      spacing: {
        fluid: {
          xs: "clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)",
          sm: "clamp(1rem, 0.8rem + 1vw, 1.5rem)",
          md: "clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)",
          lg: "clamp(2rem, 1.6rem + 2vw, 3rem)",
          xl: "clamp(3rem, 2.5rem + 2.5vw, 4.5rem)",
          "2xl": "clamp(4rem, 3rem + 5vw, 6rem)",
        },
      },
      // Modern color palette with OKLCH
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "oklch(0.95 0.02 242)",
          100: "oklch(0.90 0.04 242)",
          200: "oklch(0.80 0.06 242)",
          300: "oklch(0.70 0.08 242)",
          400: "oklch(0.60 0.10 242)",
          500: "oklch(0.55 0.12 242)",
          600: "oklch(0.50 0.14 242)",
          700: "oklch(0.45 0.12 242)",
          800: "oklch(0.35 0.10 242)",
          900: "oklch(0.25 0.08 242)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Enhanced border radius
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      // Enhanced shadows with multiple layers
      boxShadow: {
        glow: "0 0 20px -5px rgba(99, 102, 241, 0.5)",
        "glow-sm": "0 0 10px -3px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 30px -5px rgba(99, 102, 241, 0.6)",
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -4px rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 8px 24px -8px rgba(0, 0, 0, 0.08)",
        "soft-xl": "0 8px 32px -8px rgba(0, 0, 0, 0.1), 0 16px 48px -16px rgba(0, 0, 0, 0.1)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
      },
      // Enhanced animations
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
        "zoom-out": "zoom-out 0.3s ease-out",
        "bounce-subtle": "bounce-subtle 1s ease-in-out",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1.05)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      // Enhanced backdrop filters
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      // Container queries support
      supports: {
        "container-queries": "container-type: inline-size",
      },
    },
  },
  plugins: [
    require("tw-animate-css"),
  ],
};

export default config;
