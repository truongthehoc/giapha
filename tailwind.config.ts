import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#fbf7f0',
          100: '#f4ede0',
          200: '#ead8c0',
          300: '#ddbd9b',
          400: '#cfa074',
          500: '#bf8453',
          600: '#aa6d42',
          700: '#8c5436',
          800: '#6f432d',
          900: '#5a3726',
          950: '#341d13',
        },
        royal: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#f9d6ac',
          300: '#f5b977',
          400: '#f0923f',
          500: '#eb751b',
          600: '#dc5c11',
          700: '#b74410',
          800: '#913715',
          900: '#752f14',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
