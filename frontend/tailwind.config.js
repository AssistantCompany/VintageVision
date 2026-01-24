/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'var(--safe-area-inset-top)',
        'safe-bottom': 'var(--safe-area-inset-bottom)',
        'safe-left': 'var(--safe-area-inset-left)',
        'safe-right': 'var(--safe-area-inset-right)',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brass: {
          50: '#fdf8e9',
          100: '#faefc9',
          200: '#f5dd93',
          300: '#efc654',
          400: '#e9af26',
          500: '#d69514',
          600: '#b8860b', // Primary brass
          700: '#926209',
          800: '#794d10',
          900: '#674013',
        },
        patina: {
          50: '#f3f6f2',
          100: '#e4ebe1',
          200: '#c9d7c5',
          300: '#a4bb9e',
          400: '#7d9a75',
          500: '#5d7d56',
          600: '#4a6741', // Primary patina
          700: '#3a5134',
          800: '#30422c',
          900: '#293826',
        },
        velvet: {
          50: '#fdf3f4',
          100: '#fce4e6',
          200: '#faccce',
          300: '#f5a3a8',
          400: '#ed6c74',
          500: '#e14050',
          600: '#ce2537',
          700: '#ad1c2c',
          800: '#8f1a28',
          900: '#722f37', // Primary velvet
        },
      },
      animation: {
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
      },
    },
  },
  plugins: [
    // Add safe area plugin
    function({ addUtilities }) {
      const scrollbarUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(scrollbarUtilities)

      const safeAreaUtilities = {
        '.pt-safe': {
          paddingTop: 'var(--safe-area-inset-top)',
        },
        '.pb-safe': {
          paddingBottom: 'var(--safe-area-inset-bottom)',
        },
        '.pl-safe': {
          paddingLeft: 'var(--safe-area-inset-left)',
        },
        '.pr-safe': {
          paddingRight: 'var(--safe-area-inset-right)',
        },
        '.p-safe': {
          paddingTop: 'var(--safe-area-inset-top)',
          paddingBottom: 'var(--safe-area-inset-bottom)',
          paddingLeft: 'var(--safe-area-inset-left)',
          paddingRight: 'var(--safe-area-inset-right)',
        },
        '.mt-safe': {
          marginTop: 'var(--safe-area-inset-top)',
        },
        '.mb-safe': {
          marginBottom: 'var(--safe-area-inset-bottom)',
        },
        '.ml-safe': {
          marginLeft: 'var(--safe-area-inset-left)',
        },
        '.mr-safe': {
          marginRight: 'var(--safe-area-inset-right)',
        },
        '.m-safe': {
          marginTop: 'var(--safe-area-inset-top)',
          marginBottom: 'var(--safe-area-inset-bottom)',
          marginLeft: 'var(--safe-area-inset-left)',
          marginRight: 'var(--safe-area-inset-right)',
        },
      }
      
      addUtilities(safeAreaUtilities)
    }
  ],
};
