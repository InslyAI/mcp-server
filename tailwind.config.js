/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        insly: {
          orange: '#FF7D00',
          'dark-green': '#22524A',
          'button-hover': '#B14D00',
          black: '#121212',
          white: '#FFFFFF',
          'light-gray': '#F8F9FA',
          'medium-gray': '#6C757D',
          border: '#E9ECEF',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}