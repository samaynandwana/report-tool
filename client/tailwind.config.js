/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        company: {
          50: '#f3f1fc',
          100: '#e9e4f9',
          500: '#734BD1',
          600: '#6339c0',
          700: '#5227af'
        }
      }
    },
  },
  plugins: [],
} 