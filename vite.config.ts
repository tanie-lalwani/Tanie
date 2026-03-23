import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('three')) return 'three';
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@mui')) return 'mui';
            // Add more libraries as needed
            return 'vendor';
          }
        },
      },
    },
  },
})
