/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* Цвета проекта — взяты из макета Figma */
      colors: {
        cream: '#faf6f0',
        'cream-dark': '#efe7dd',
        brown: {
          button: '#d2a679',
          dark: '#2a1c17',
          bg: '#1f1714',
          footer: '#140f0c',
        },
      },
      /* Шрифты проекта */
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
