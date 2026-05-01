/** @type {import('tailwindcss').Config} */
module.exports = {
  // Указываем файлы, в которых будем использовать классы Tailwind
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}