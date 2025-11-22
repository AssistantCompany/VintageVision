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
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
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
