/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Paleta de cores do prontuMed mantida
        primary: {
          50: '#fff8e6',
          100: '#ffefc3',
          200: '#ffe09b',
          300: '#ffcd66',
          400: '#ffbc3d',
          500: '#ffab07', // Laranja principal
          600: '#e69900',
          700: '#cc7a00',
          800: '#a65c00',
          900: '#804800',
        },
        secondary: {
          50: '#fcfaeb',
          100: '#f8f4d0',
          200: '#f2eba9',
          300: '#ede17f',
          400: '#e9d558', // Amarelo principal
          500: '#e4ca2f',
          600: '#c9b01a',
          700: '#a38a15',
          800: '#7d6911',
          900: '#60510d',
        },
        accent: {
          50: '#edf5ee',
          100: '#d3e6d5',
          200: '#b6d5b9',
          300: '#94c398',
          400: '#72ad75', // Verde principal
          500: '#5a9a5e',
          600: '#4a8a4e',
          700: '#3b703e',
          800: '#2d5730',
          900: '#224224',
        },
        teal: {
          50: '#e6f5f6',
          100: '#c1e5e7',
          200: '#97d4d7',
          300: '#63bfc4',
          400: '#39a9af',
          500: '#0e8d94', // Azul-esverdeado principal
          600: '#0c7a80',
          700: '#0a6269',
          800: '#084a50',
          900: '#06393e',
        },
        gray: {
          50: '#f2f3f4',
          100: '#e6e8e9',
          200: '#cdd0d3',
          300: '#a8adb2',
          400: '#7d848a',
          500: '#5e666d',
          600: '#434d53', // Cinza escuro principal
          700: '#394146',
          800: '#2e3539',
          900: '#1f2427',
        },
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        nav: '0 2px 4px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      zIndex: {
        '-10': '-10',
        '60': '60',
        '70': '70',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
