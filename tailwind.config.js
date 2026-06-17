/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        rose: {
          50: "#FFF5F6",
          100: "#FDE8EA",
          200: "#F9D4D8",
          300: "#F3B7BE",
          400: "#E8B4B8",
          500: "#D4888F",
          600: "#B86B72",
          700: "#8B2635",
          800: "#6B1E29",
          900: "#4A141C",
        },
        champagne: {
          50: "#FDF8F3",
          100: "#F8EDE1",
          200: "#F0D9BE",
          300: "#E5C096",
          400: "#D4AF89",
          500: "#C49968",
          600: "#A87D4D",
          700: "#8A643E",
          800: "#6B4E32",
          900: "#4A3624",
        },
        cream: {
          50: "#FFFBF8",
          100: "#FFF5EE",
          200: "#FFE8D6",
          300: "#FFD9B7",
        },
        wine: {
          500: "#8B2635",
          600: "#7A1F2D",
          700: "#6B1E29",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Noto Sans SC", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        elegant: "0 4px 20px -4px rgba(212, 175, 137, 0.25)",
        romantic: "0 8px 32px -8px rgba(232, 180, 184, 0.35)",
        "inner-gold": "inset 0 1px 0 rgba(212, 175, 137, 0.3)",
      },
      backgroundImage: {
        "gradient-romantic": "linear-gradient(135deg, #E8B4B8 0%, #D4AF89 100%)",
        "gradient-rose": "linear-gradient(135deg, #FDE8EA 0%, #FFF5EE 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF89 0%, #C49968 100%)",
      },
    },
  },
  plugins: [],
};
