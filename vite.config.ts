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

// Plugin para transformar HTML con preloads
const htmlTransform = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        '</head>',
        `
        <link rel="preload" href="/assets/css/index.css" as="style">
        <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="dns-prefetch" href="//fonts.googleapis.com">
        <link rel="dns-prefetch" href="//unsplash.com">
        <link rel="dns-prefetch" href="//api.accuweather.com">
        </head>
        `
      );
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyStaticFiles(), htmlTransform()],
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting optimizado - estrategia más agresiva
        manualChunks: (id) => {
          // React core - mantener separado
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          
          // Routing - separar para navegación
          if (id.includes('node_modules/react-router')) {
            return 'routing';
          }
          
          // UI Components - agrupar librerías de UI
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/@headlessui') ||
              id.includes('node_modules/@heroicons')) {
            return 'ui-components';
          }
          
          // AI/ML - separar por ser pesado
          if (id.includes('node_modules/@google/generative-ai') || 
              id.includes('node_modules/@google/genai')) {
            return 'ai-services';
          }
          
          // Markdown y parsing - agrupar
          if (id.includes('node_modules/react-markdown') || 
              id.includes('node_modules/remark') || 
              id.includes('node_modules/rehype') ||
              id.includes('node_modules/hast')) {
            return 'markdown';
          }
          
          // Utilidades - agrupar librerías pequeñas
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/lodash') ||
              id.includes('node_modules/classnames') ||
              id.includes('node_modules/clsx')) {
            return 'utils';
          }
          
          // Weather y APIs externas
          if (id.includes('node_modules/unsplash-js') ||
              id.includes('node_modules/node-fetch')) {
            return 'external-apis';
          }
          
          // Si es un módulo de node_modules, agrupar en vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimizar nombres de archivos
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(name)) {
            return `assets/css/[name]-[hash][extname]`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // Optimizaciones de CSS
    cssCodeSplit: true,
    // Optimizaciones de assets
    assetsInlineLimit: 4096,
    // Chunk size warning limit - reducido para forzar optimizaciones
    chunkSizeWarningLimit: 1000,
    // Añadir source maps para debugging en producción
    sourcemap: false,
  },
  // Optimizaciones de desarrollo
  server: {
    port: 5174,
    host: '0.0.0.0',
    strictPort: false,
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
    exclude: [
      // Excluir dependencias pesadas del pre-bundling
      '@google/genai',
      'unsplash-js',
    ],
  },
})
