/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    extend: {
      zIndex: {
        '9960': '9960',
        '9970': '9970',
        '9980': '9980',
        '9990': '9990',
        '9999': '9999',
      }
    },
  },
  plugins: [],
}

