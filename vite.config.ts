import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

// Plugin para copiar archivos estáticos importantes
const copyStaticFiles = () => {
  return {
    name: 'copy-static-files',
    writeBundle() {
      const filesToCopy = [
        'sitemap.xml',
        'robots.txt',
        'browserconfig.xml',
        'site.webmanifest',
        'favicon.ico',
        'favicon-96x96.png',
        'favicon.svg',
        'web-app-manifest-192x192.png',
        'web-app-manifest-512x512.png'
      ];
      
      filesToCopy.forEach(file => {
        // Buscar en public primero, luego en la raíz
        let sourcePath = join(__dirname, 'public', file);
        if (!existsSync(sourcePath)) {
          sourcePath = join(__dirname, file);
        }
        const destPath = join(__dirname, 'dist', file);
        
        if (existsSync(sourcePath)) {
          copyFileSync(sourcePath, destPath);
          console.log(`✅ Copiado: ${file}`);
        } else {
          console.log(`⚠️ No encontrado: ${file}`);
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyStaticFiles()],
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
          const name = assetInfo.name || 'asset';
          const info = name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(name)) {
            return `assets/style.css`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
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
