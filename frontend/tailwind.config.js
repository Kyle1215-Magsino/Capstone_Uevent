/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  safelist: [
    { pattern: /^bg-(dark|forest|leaf|brand|accent|surface)-/ },
    { pattern: /^text-(dark|forest|leaf|brand|accent|surface)-/ },
    { pattern: /^border-(dark|forest|leaf|brand|accent)-/ },
    { pattern: /^shadow-(dark|forest|leaf|brand|accent)-/ },
    { pattern: /^hover:bg-(dark|forest|leaf|brand|accent)-/ },
    { pattern: /^hover:text-(dark|forest|leaf|brand|accent)-/ },
    { pattern: /^animate-(fadeInUp|fadeIn|slideInLeft|scaleIn|float|pulse2|slideInDrawer|slideOutDrawer|backdropIn|backdropOut|pageEnter|staggerIn)$/ },
  ],
  theme: {
    extend: {
      colors: {
        accent: '#38BDF8',
        surface: '#FFFFFF',
        primary: '#22C55E',
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#22c55e',
          500: '#16a34a',
        },
        leaf: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        forest: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#22C55E',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        dark: {
          700: '#94a3b8',
          800: '#64748b',
          900: '#1e293b',
          950: '#0f172a',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        slideInDrawer: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '60%':  { transform: 'translateX(2%)', opacity: '1' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutDrawer: {
          '0%':   { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        backdropIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        backdropOut: {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
        pageEnter: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        staggerIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeInUp:       'fadeInUp 0.5s ease-out both',
        fadeIn:         'fadeIn 0.4s ease-out both',
        slideInLeft:    'slideInLeft 0.4s ease-out both',
        scaleIn:        'scaleIn 0.35s ease-out both',
        float:          'float 3s ease-in-out infinite',
        pulse2:         'pulse2 2s ease-in-out infinite',
        slideInDrawer:  'slideInDrawer 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        slideOutDrawer: 'slideOutDrawer 0.25s cubic-bezier(0.4, 0, 0.6, 1) both',
        backdropIn:     'backdropIn 0.25s ease-out both',
        backdropOut:    'backdropOut 0.22s ease-out both',
        pageEnter:      'pageEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        staggerIn:      'staggerIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
    },
  },
  plugins: [],
}

