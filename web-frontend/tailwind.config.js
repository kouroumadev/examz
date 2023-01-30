module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './Layout/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'upcoming': "url('../public/asset/img/bg_upcoming.svg')",
        'upcoming-mobile': "url('../public/asset/img/bg_upcoming_mobile.svg')",
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        black: {
          1: '#1F2933',
          2: '#323F4B',
          3: '#475A6B',
          4: '#7B8794',
          5: '#9AA5B1',
          6: '#CBD2D9',
          7: '#E4E7EB',
          8: '#F2F3F5',
          9: '#F8F9FA',
        },
        green: {
          1: '#00BB1D',
          2: '#EBFFEE',
          3: '#D3FFDA',
        },
        blue: {
          1: '#324ECF',
          2: '#5A71D8',
          3: '#7B8DE0',
          4: '#9CAAE8',
          6: '#EEF1FB',
        },
        red: {
          1: '#FF4B4B',
          2: '#FFE8E8',
          3: '#FFF8F8',
        },
        yellow: {
          1: '#FFC431',
          2: '#FFDC85'
        },
        purple: {
          1: '#F3F0FA',
          2: '#7348C3'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
