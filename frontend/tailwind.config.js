/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#EDF0EA',
        ink: '#232B24',
        sage: '#6E7A6C',
        mint: '#2F7F5C',
        'mint-soft': '#D7E4D5',
        hairline: '#D2DACD',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
