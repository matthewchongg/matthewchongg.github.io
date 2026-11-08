import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base path ensures assets resolve cleanly on GitHub Pages
  // whether deployed to username.github.io or username.github.io/repo-name/
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
