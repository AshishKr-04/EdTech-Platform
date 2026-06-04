/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#FAF6F0',   // Warm oatmeal/cream background
          100: '#F3EDE2',  // Warm sand toggle/card backing
          150: '#E9DEC9',  // Sand separator
          200: '#E2DAC9',  // Sand border
          300: '#D4C6AC',  // Sand hover
          400: '#B09E80',  // Warm icon/placeholder
          500: '#8C7759',  // Muted body text / secondary
          600: '#6E5D46',  // Normal body text
          700: '#534635',  // Dark link hover
          800: '#3A3025',  // Dark warm text
          900: '#251F19',  // Title ink / headers
          950: '#14110E',  // Deep ink
        },
        gray: {
          50: '#FAF6F0',   // Warm oatmeal/cream background
          100: '#F3EDE2',  // Warm sand toggle/card backing
          200: '#E2DAC9',  // Sand border
          300: '#D4C6AC',  // Sand hover
          400: '#B09E80',  // Warm icon/placeholder
          500: '#8C7759',  // Muted body text / secondary
          600: '#6E5D46',  // Normal body text
          700: '#534635',  // Dark link hover
          800: '#3A3025',  // Dark warm text
          900: '#251F19',  // Title ink / headers
        },
        neutral: {
          50: '#FAF6F0',   // Warm oatmeal/cream background
          100: '#F3EDE2',  // Warm sand toggle/card backing
          200: '#E2DAC9',  // Sand border
          300: '#D4C6AC',  // Sand hover
          400: '#B09E80',  // Warm icon/placeholder
          500: '#8C7759',  // Muted body text / secondary
          600: '#6E5D46',  // Normal body text
          700: '#534635',  // Dark link hover
          800: '#3A3025',  // Dark warm text
          900: '#251F19',  // Title ink / headers
        },
        indigo: {
          50: '#EEF2FF',   // Lavender tint
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',  // Custom active violet-indigo
          600: '#4F46E5',  // Solid CTA brand color
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        }
      }
    },
  },
  plugins: [],
}