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
        coral: '#f47b5c',
        'coral-light': '#fef0ed',
        ink: '#2d2d2d',
        paper: '#f8f8f8',
        grey: '#6b7280',
        'grey-light': '#e5e7eb',
        'grey-dark': '#374151',
        yellow: '#f5a623',
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
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '10px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
