import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),
      // Include vueDevTools only in development mode
      ...(isDevelopment ? [vueDevTools()] : []),
    ],
    server: {
      host: true, // Allow external connections if needed
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist', // Specify output directory for clarity
    },
  };
});