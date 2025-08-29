import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Configuración específica para desarrollo
  server: {
    port: 5174,
    host: '0.0.0.0',
    strictPort: false,
    hmr: {
      overlay: false,
    },
    // Configuración para desarrollo local
    open: true, // Abrir navegador automáticamente
    cors: true, // Habilitar CORS para desarrollo
  },
  // Optimizaciones para desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@google/generative-ai',
    ],
  },
  // Configuración de build para desarrollo
  build: {
    sourcemap: true, // Habilitar source maps para debugging
    minify: false, // No minificar en desarrollo
    rollupOptions: {
      output: {
        manualChunks: undefined, // Deshabilitar code splitting en desarrollo
      },
    },
  },
  // Variables de entorno para desarrollo
  define: {
    __DEV__: true,
  },
}); 