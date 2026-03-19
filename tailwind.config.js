/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F0EEFF',
          100: '#E0DBFF',
          200: '#C4BBFF',
          300: '#A193FF',
          400: '#7C6BF0',
          500: '#5B4FD6',
          600: '#4A3FC2',
          700: '#3A30A3',
          800: '#2A2278',
          900: '#1C174F',
        },
        surface: {
          50:  '#FFFFFF',
          100: '#F8F7FA',
          200: '#F0EFF4',
          300: '#E8E6EE',
          400: '#D5D3DE',
          500: '#A9A7B5',
          600: '#6E6C7A',
          700: '#4A4857',
          800: '#2D2B3A',
          900: '#1A1826',
        },
        success: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        coral: {
          50:  '#FFF3EE',
          100: '#FFE5D8',
          200: '#FFCAB2',
          500: '#F97455',
          600: '#E85B3A',
          700: '#C44220',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:        '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
        'card-hover':'0 4px 16px -2px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.03)',
        elevated:    '0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
        modal:       '0 24px 64px -16px rgba(0,0,0,0.20), 0 8px 24px -4px rgba(0,0,0,0.08)',
        sidebar:     '1px 0 0 0 rgba(0,0,0,0.06)',
        sm:          '0 1px 2px 0 rgba(0,0,0,0.04)',
        soft:        '0 2px 8px 0 rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
