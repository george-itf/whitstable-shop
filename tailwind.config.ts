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
