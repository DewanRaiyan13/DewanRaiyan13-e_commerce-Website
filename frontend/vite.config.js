import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-icons'],
          utils: ['axios', 'yup', 'react-hook-form']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
  }
});
