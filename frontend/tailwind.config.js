/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { 50: '#FDFBF7', 100: '#FAF7F0', 200: '#F5EFE0', 300: '#EEE2CC' },
        champagne: { 100: '#F7E7CE', 200: '#F0D5A8', 300: '#E8C37F', 400: '#D4A853', 500: '#C49A3C' },
        rose: { 50: '#FFF0F3', 100: '#FFE1E8', 200: '#FFC2D0', 300: '#FF94AB', 400: '#FF5C7F' },
        burgundy: { 100: '#F5C6D0', 200: '#E88A9A', 300: '#C94D62', 400: '#A32040', 500: '#7A0020', 600: '#5C0018' },
        mauve: { 100: '#F3E8F0', 200: '#E6D0E1', 300: '#C9A8C4', 400: '#A87FA3', 500: '#8A5A85' },
        charcoal: { 100: '#E8E6E3', 200: '#C5C1BB', 300: '#938E87', 400: '#635D56', 500: '#3D3830', 600: '#242019', 700: '#151210', 800: '#0D0B08' },
      },
      fontFamily: { display: ['Playfair Display', 'Georgia', 'serif'], body: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: { glass: '0 4px 30px rgba(0,0,0,0.1)', 'glass-lg': '0 8px 60px rgba(0,0,0,0.15)', elegant: '0 2px 40px rgba(196,154,60,0.15)' },
    },
  },
  plugins: [],
};
