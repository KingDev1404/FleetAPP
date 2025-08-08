import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fafafd", // Your specified background
        foreground: "#0b0b15", // Your specified text color
        primary: {
          DEFAULT: "#2f27ce", // Your specified primary
          foreground: "#fafafd",
        },
        secondary: {
          DEFAULT: "#9454e3", // Your specified secondary
          foreground: "#fafafd",
        },
        accent: {
          DEFAULT: "#5a53e0", // Your specified accent
          foreground: "#fafafd",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f1f1f4", // Slightly darker than background for muted elements
          foreground: "#6b7280", // Muted text color
        },
        popover: {
          DEFAULT: "#fafafd",
          foreground: "#0b0b15",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0b0b15",
        },
        sidebar: {
          DEFAULT: "#0b0b15", // Using your text color for dark sidebar
          foreground: "#fafafd", // Using background color for sidebar text
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
