import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Lighting-Study-System/',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_STATIC_DEMO': JSON.stringify('true')
  },
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true
  }
});
