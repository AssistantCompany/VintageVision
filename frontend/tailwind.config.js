/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Safe area spacing for iOS */
      spacing: {
        'safe-top': 'var(--safe-area-inset-top)',
        'safe-bottom': 'var(--safe-area-inset-bottom)',
        'safe-left': 'var(--safe-area-inset-left)',
        'safe-right': 'var(--safe-area-inset-right)',
      },
      /* Touch target sizing */
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      /* Typography */
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      /* shadcn/ui Color System via CSS Variables */
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        /* Semantic status colors for dark theme */
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          muted: 'hsl(var(--success-muted))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          muted: 'hsl(var(--warning-muted))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          muted: 'hsl(var(--info-muted))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
          muted: 'hsl(var(--danger-muted))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        /* VintageVision custom colors */
        brass: {
          DEFAULT: 'hsl(var(--brass))',
          light: 'hsl(var(--brass-light))',
          dark: 'hsl(var(--brass-dark))',
        },
        patina: 'hsl(var(--patina))',
        velvet: 'hsl(var(--velvet))',
      },
      /* Border radius using CSS variable */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      /* Animations */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'dramatic-reveal': 'dramatic-reveal 0.6s ease-out forwards',
        'curtain-lift': 'curtain-lift 0.8s ease-out forwards',
        'brass-glow': 'brass-glow-pulse 2s ease-in-out infinite',
        'value-counter': 'value-counter 0.4s ease-out forwards',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
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
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'dramatic-reveal': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.98)',
            filter: 'blur(4px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)',
          },
        },
        'curtain-lift': {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'brass-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
          '50%': { boxShadow: '0 0 40px hsl(var(--primary) / 0.5)' },
        },
        'value-counter': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      /* Backdrop blur levels */
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
      },
    },
  },
  plugins: [
    /* Scrollbar utilities */
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

      /* Safe area utilities */
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
    },
    /* Tailwind CSS Animate plugin equivalent */
    require('tailwindcss-animate'),
  ],
};
