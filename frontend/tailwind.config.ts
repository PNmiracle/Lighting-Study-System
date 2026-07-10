import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
      },
    },
  },
  corePlugins: {
    preflight: false, // 避免 Tailwind 重置与 MUI 冲突
  },
  plugins: [],
};

export default config;
