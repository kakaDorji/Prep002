/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4267B2',  // Facebook blue
          DEFAULT: '#1877F2', // Facebook blue (brighter)
          dark: '#145DA0',
        },
        secondary: {
          light: '#60A5FA', // Lighter blue
          DEFAULT: '#3B82F6', // Medium blue
          dark: '#2563EB',  // Darker blue
        },
        background: '#F0F8FF',
        text: '#1F2937',     // Dark gray for text
      },
    },
  },
  plugins: [],
}
