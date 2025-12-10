import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    hmr: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/renderer/components'),
      '@hooks': path.resolve(__dirname, './src/renderer/hooks'),
      '@services': path.resolve(__dirname, './src/renderer/services'),
      '@utils': path.resolve(__dirname, './src/renderer/utils'),
      '@types': path.resolve(__dirname, './src/renderer/types'),
      '@theme': path.resolve(__dirname, './src/renderer/theme'),
    },
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
