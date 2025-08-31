/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nifty-blue': '#1e40af',
        'profit-green': '#10b981',
        'loss-red': '#ef4444',
        'market-neutral': '#6b7280'
      }
    },
  },
  plugins: [],
}
