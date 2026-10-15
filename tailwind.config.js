/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1F6F8B', 50: '#EAF4F8', 100: '#CFE6EE', 200: '#A3CEDE', 300: '#72B2CA', 400: '#4595B4', 500: '#1F6F8B', 600: '#195A72', 700: '#134659', 800: '#0D3140', 900: '#081F28' },
        accent: { DEFAULT: '#00ACC1', 600: '#008A9B' },
        ember: { DEFAULT: '#E08A3C', 600: '#C06F26' },
        ink: { DEFAULT: '#101518', soft: '#1B2227', line: '#2A343B' },
        paper: { DEFAULT: '#FAFAF8', card: '#FFFFFF' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn .4s ease-out both',
        'slide-up': 'slideUp .4s ease-out both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
