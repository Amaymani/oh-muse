/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        "darkbg":"#323232",
        "darkbg2":"#414141",
        "lightbg":"#FFFFFF",
        "lightbg2":"#F8F8F8",
        "purp":"#973EDC",
        "yell":"#E2AF15"
      },
    },
    
  },
  plugins: [],
};
