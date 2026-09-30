/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F2A4A",
        secondary: "#F2A93B",
        accent: "#10B981",
        danger: "#EF4444",
        light: "#F3F4F6",
        dark: "#111827",
        system: {
          primary: "#F2A93B",
          background: "var(--System-Background, #FEFEFE)"
        },
        toast: {
          info: "#F2A93B",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444"
        },
        header: "#FFF4E2",
        tabActive: "#0F2A4A",
        scrollbarTrack: "#E5E7EB",
        scrollbarThumb: "#F2A93B",
        systemText: "#0F2A4A",
        success: {
          DEFAULT: "#10B981",
          50: "#E6F9F1",
          100: "#C2F0D9",
          200: "#99E7C0",
          300: "#70DDA6",
          400: "#4CD590",
          500: "#26CC77",
          600: "#10B981",
          700: "#0E9A66",
          800: "#0B7B53",
          900: "#075B3A"
        },
        yellow: {
          DEFAULT: "#F59E0B",
          50: "#FFF7E6",
          100: "#FFE9BF",
          200: "#FFD999",
          300: "#FFC966",
          400: "#FFB933",
          500: "#F59E0B",
          600: "#D48809",
          700: "#B27307",
          800: "#8F5C05",
          900: "#6B4603"
        }
      },
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        inter: ["Montserrat", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      fontSize: {
        paragraph: ["18px", "28px"]
      },
      fontWeight: {
        medium: 500
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        custom: "12px",
        full: "9999px"
      },
      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        160: "40rem"
      },
      keyframes: {
        "slide-fade-in": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-fade-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0" }
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" }
        },
        "page-enter": {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "mobile-menu-enter": {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        "slide-fade-in": "slide-fade-in 0.3s ease-out forwards",
        "slide-fade-out": "slide-fade-out 0.3s ease-in forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-in forwards",
        "page-enter": "page-enter 0.45s ease-out both",
        "mobile-menu-enter": "mobile-menu-enter 0.22s ease-out both"
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".hide-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none"
        },
        ".hide-scrollbar::-webkit-scrollbar": {
          display: "none"
        }
      });
    }
  ]
};
