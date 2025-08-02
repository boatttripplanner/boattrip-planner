import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Optimizaciones de rendimiento
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting optimizado
        manualChunks: {
          // Separar React y React DOM
          'react-vendor': ['react', 'react-dom'],
          // Separar librerías de UI
          'ui-vendor': ['react-router-dom', 'lucide-react'],
          // Separar librerías de AI/ML
          'ai-vendor': ['@google/generative-ai'],
          // Separar librerías de utilidades
          'utils-vendor': ['date-fns', 'lodash-es'],
        },
        // Optimizar nombres de archivos
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/style.css`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // Optimizaciones de CSS
    cssCodeSplit: true,
    // Optimizaciones de assets
    assetsInlineLimit: 4096,
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimizaciones de desarrollo
  server: {
    hmr: {
      overlay: false,
    },
  },
  // Optimizaciones de preload
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@google/generative-ai',
    ],
  },
})
