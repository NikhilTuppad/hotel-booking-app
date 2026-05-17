/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        primary: '#ff385c',
        primaryDark: '#d90b3a',
        brand: '#ff385c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.15)',
        'float': '0 20px 40px -15px rgba(0,0,0,0.1)',
        'glow': '0 0 40px -10px rgba(255, 56, 92, 0.25)',
        'glow-blue': '0 0 40px -10px rgba(0, 101, 255, 0.25)',
      },
      animation: {
        blob: "blob 15s infinite alternate",
        'blob-slow': "blob 20s infinite alternate-reverse",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        }
      }
    },
  },
  plugins: [],
}
