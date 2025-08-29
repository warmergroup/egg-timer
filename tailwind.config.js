/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': {
          50: '#FFFDF5',
          100: '#FDF7E3',
          200: '#FEF3C7',
        },
        'pastel': {
          'yellow': '#FDE68A',
          'green': '#86EFAC', 
          'pink': '#FBCFE8',
          'blue': '#93C5FD',
        },
        'neumorphic': {
          'light': '#F0F0F3',
          'dark': '#AEAEC0',
          'white': '#FFFFFF',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.3s ease-in-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-down': 'fade-down 0.5s ease-out',
        'scale-bounce': 'scale-bounce 0.2s ease-out',
        'rise-fade': 'rise-fade 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'button-press': 'button-press 0.15s ease-out',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'rise-fade': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(0.9)' },
        },
        'slide-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-30px)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' },
        },
      },
      boxShadow: {
        // Enhanced neumorphic shadows - More pronounced and clear
        'neumorphic': '-10px -10px 20px rgba(255, 255, 255, 0.9), 10px 10px 20px rgba(163, 177, 198, 0.3)',
        'neumorphic-hover': '-15px -15px 30px rgba(255, 255, 255, 0.95), 15px 15px 30px rgba(163, 177, 198, 0.4)',
        'neumorphic-pressed': 'inset 8px 8px 16px rgba(163, 177, 198, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorphic-inset': 'inset 8px 8px 16px rgba(163, 177, 198, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorphic-soft': '-6px -6px 12px rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(163, 177, 198, 0.25)',
        
        // Timer specific shadows - More pronounced for circular design
        'neumorphic-timer': '-20px -20px 50px rgba(255, 255, 255, 0.9), 20px 20px 50px rgba(163, 177, 198, 0.35)',
        'neumorphic-timer-inset': 'inset 12px 12px 24px rgba(163, 177, 198, 0.3), inset -12px -12px 24px rgba(255, 255, 255, 0.9)',
        
        // Card shadows for egg selection - Enhanced clarity
        'neumorphic-card': '-8px -8px 16px rgba(255, 255, 255, 0.9), 8px 8px 16px rgba(163, 177, 198, 0.3)',
        'neumorphic-card-hover': '-12px -12px 24px rgba(255, 255, 255, 0.95), 12px 12px 24px rgba(163, 177, 198, 0.4)',
        
        // Button shadows - More distinct
        'neumorphic-button': '-6px -6px 12px rgba(255, 255, 255, 0.9), 6px 6px 12px rgba(163, 177, 198, 0.3)',
        'neumorphic-button-pressed': 'inset 6px 6px 12px rgba(163, 177, 198, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.8)',
        'neumorphic-button-active': '-3px -3px 6px rgba(255, 255, 255, 0.9), 3px 3px 6px rgba(163, 177, 198, 0.3)',
      },
      borderRadius: {
        'neumorphic': '20px',
        'egg': '50%',
        'timer': '50%',
        'card': '16px',
        'button': '18px',
      },
      backgroundImage: {
        'neumorphic-gradient': 'linear-gradient(145deg, #F0F0F3, #E6E6E9)',
        'neumorphic-inset-gradient': 'linear-gradient(145deg, #E6E6E9, #F0F0F3)',
      }
    },
  },
  plugins: [],
}