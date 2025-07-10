/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "text-800": "#777777",
        "text-900": "#000000",
        "text-500": "#AAAAAA",
        "bg-900": "#349800",
      },
    },
  },
  plugins: [],
}