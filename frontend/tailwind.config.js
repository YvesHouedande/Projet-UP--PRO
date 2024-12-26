/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.jsx",
    flowbite.content(),
  ],
  theme: {
    extend: {
        screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '875px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [flowbite.plugin(),],
}