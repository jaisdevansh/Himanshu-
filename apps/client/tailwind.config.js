/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0B07',
        surface: '#1A1510',
        primary: '#F5EFE0',
        accent: '#D4522A',
        gold: {
          DEFAULT: '#C8973A',
          light: '#E8B96A'
        },
        cream: '#F5EFE0',
        charcoal: '#1A1510',
        dark: '#0E0B07',
        warmgrey: '#6B6055'
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        fadeUp: 'fadeUp 0.9s ease forwards',
        fadeDown: 'fadeDown 0.8s ease forwards',
        scrollPulse: 'scrollPulse 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
