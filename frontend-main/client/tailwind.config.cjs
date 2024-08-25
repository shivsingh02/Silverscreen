/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'searchbg': "url('./src/assets/images/movies.jpg')",
      }
    },
    fontFamily: {
      'poppins': ['Poppins', 'sans-serif'],
      'Roboto': ['Roboto', 'sans-serif'],
      'Franklin Gothic Medium': ['Arial', 'sans-serif'] 
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  
}
