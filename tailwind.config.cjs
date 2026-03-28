module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'dark-green':  '#0F2D25',
        'dark-sage':   '#24433B',
        'sage':        '#6D7E76',
        'ivory':       '#E0D7B7',
        'parchment':   '#F7F4EE',
        'almost-black':'#211A1D',
      },
      height: {
        'sign-in-modal': '600px',
      },
    },
  },
  plugins: [],
};
