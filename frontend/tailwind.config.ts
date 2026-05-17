import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#a8dadc',
        secondary: '#457b9d',
        accent: {
          1: '#00b4d8',
          2: '#ade8f4',
        },
      },
      backgroundColor: {
        primary: '#a8dadc',
        secondary: '#457b9d',
        'accent-1': '#00b4d8',
        'accent-2': '#ade8f4',
      },
      textColor: {
        primary: '#a8dadc',
        secondary: '#457b9d',
        'accent-1': '#00b4d8',
        'accent-2': '#ade8f4',
      },
      borderColor: {
        primary: '#a8dadc',
        secondary: '#457b9d',
        'accent-1': '#00b4d8',
        'accent-2': '#ade8f4',
      },
    },
  },
  plugins: [],
};

export default config;
