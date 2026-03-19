/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
