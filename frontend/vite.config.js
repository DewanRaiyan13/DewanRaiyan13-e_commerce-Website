import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('framer-motion') || id.includes('react-icons')) {
              return 'ui';
            }
            if (id.includes('axios') || id.includes('yup') || id.includes('react-hook-form')) {
              return 'utils';
            }
            return 'vendor-other';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
  }
});
