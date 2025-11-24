import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // These colors will use the custom defined scales below, or fallback to CSS variables if not fully configured.
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // --- Custom Colors based on User Request ---
        danger: { // Red color for better categorization
          50: "oklch(0.96 0.05 32.4)",
          100: "oklch(0.91 0.07 32.4)",
          200: "oklch(0.81 0.1 32.4)",
          300: "oklch(0.7 0.14 32.4)",
          400: "oklch(0.58 0.17 32.4)",
          500: "oklch(0.48 0.201 32.4)", // Red #cc3333
          600: "oklch(0.43 0.19 32.4)",
          700: "oklch(0.38 0.17 32.4)",
          800: "oklch(0.32 0.14 32.4)",
          900: "oklch(0.27 0.1 32.4)",
          950: "oklch(0.23 0.08 32.4)",
        },
        fabioGreen: { // Green color scale based on #087c65
          50: "oklch(0.96 0.03 160.7)",
          100: "oklch(0.91 0.05 160.7)",
          200: "oklch(0.81 0.08 160.7)",
          300: "oklch(0.7 0.1 160.7)",
          400: "oklch(0.58 0.12 160.7)",
          500: "oklch(0.485 0.134 160.7)", // #087c65
          600: "oklch(0.43 0.12 160.7)",
          700: "oklch(0.38 0.11 160.7)",
          800: "oklch(0.32 0.09 160.7)",
          900: "oklch(0.27 0.07 160.7)",
          950: "oklch(0.23 0.06 160.7)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;