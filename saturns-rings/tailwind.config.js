/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'saturn-beige': '#FAEBD7',
        'saturn-tan': '#D2B48C',
        'saturn-brown': '#8B7355',
        'ring-ice': '#E0F2FF',
        'ring-dust': '#A0522D',
        'space-black': '#000814',
      },
      animation: {
        'ring-rotate': 'ring-rotate 120s linear infinite',
        'ring-particles': 'ring-particles 90s linear infinite',
      },
      keyframes: {
        'ring-rotate': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        'ring-particles': {
          '0%': { transform: 'rotateZ(0deg)' },
          '100%': { transform: 'rotateZ(360deg)' },
        },
      },
    },
  },
  plugins: [],
}