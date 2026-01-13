import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: '#5BB5E0',
        'sky-light': '#e8f4fa',
        'sky-dark': '#3a9bc9',
        coral: '#f47b5c',
        'coral-light': '#fef0ed',
        'coral-dark': '#e5654a',
        ink: '#2d2d2d',
        paper: '#f8f8f8',
        grey: '#6b7280',
        'grey-light': '#e5e7eb',
        'grey-dark': '#374151',
        yellow: '#f5a623',
        'yellow-light': '#fef3c7',
        green: '#10b981',
        'green-light': '#d1fae5',
        // Oyster - neutral grayscale for text hierarchy
        oyster: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Ocean - secondary blue palette
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Sand - warm neutral for beaches
        sand: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f9ecd9',
          300: '#f4dbb8',
          400: '#e9c48c',
          500: '#d4a660',
          600: '#b88a45',
          700: '#9a7238',
          800: '#7d5c2e',
          900: '#654a25',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '10px',
        'pill': '9999px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(91, 181, 224, 0.25)',
        'glow-coral': '0 0 20px rgba(244, 123, 92, 0.25)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-sky': 'linear-gradient(135deg, #5BB5E0 0%, #38bdf8 100%)',
        'gradient-coral': 'linear-gradient(135deg, #f47b5c 0%, #fb923c 100%)',
        'gradient-ocean': 'linear-gradient(180deg, #5BB5E0 0%, #0ea5e9 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f47b5c 0%, #f5a623 100%)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
