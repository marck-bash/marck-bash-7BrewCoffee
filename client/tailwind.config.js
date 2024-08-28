/** @type {import('tailwindcss').Config} */
export default {
  
}

module.exports = {
  //...
  content: [
    "./index.html",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
  themes: [
    {
    light: {
      ...require("daisyui/src/theming/themes")["light"],
      "primary": "#8a2432", //7Brew Maroon
      "secondary": "231F20", //7Brew Black
      "accent": "white",
      "neutral": "black"
    },
    dark: {
      ...require("daisyui/src/theming/themes")["dark"],
      "primary":  "#8a2432", //7Brew Maroon
      "secondary": "#8a2432", //7Brew Maroon
      "accent": "black",
      "neutral": "white"
    },
  },
],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}

