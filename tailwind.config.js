/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#d4af37',
        primaryLight: '#2c5282',
        primaryDark: '#153e75',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
