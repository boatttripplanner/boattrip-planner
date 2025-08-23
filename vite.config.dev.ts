import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Configuración específica para desarrollo
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5175,
    host: '127.0.0.1', // Forzar IPv4 localhost
    hmr: {
      overlay: false,
      port: 5175,
      host: '127.0.0.1',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@google/generative-ai',
    ],
  },
}); 