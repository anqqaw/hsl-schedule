/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#4B0082',
        'deep-red': '#8B0000',
        'dark-green': '#006400',
        'deep-blue': '#00008B',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      },
    },
  },
  variants: {
    extend: {
      backdropFilter: ['responsive'],
    },
  },
  plugins: [],
}

