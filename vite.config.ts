import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDevelopment = mode === 'development';
    
    return {
      base: '/',
      root: '.',
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html')
          },
          output: {
            manualChunks: {
              // Core React chunks
              'react-vendor': ['react', 'react-dom'],
              // AI/ML chunks
              'ai-vendor': ['@google/genai'],
              // UI/Markdown chunks
              'ui-vendor': ['react-markdown', 'remark-gfm']
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) {
                return 'assets/[name][extname]';
              }
              if (assetInfo.name?.endsWith('.png') || assetInfo.name?.endsWith('.jpg') || assetInfo.name?.endsWith('.jpeg') || assetInfo.name?.endsWith('.webp')) {
                return 'assets/images/[name]-[hash][extname]';
              }
              if (assetInfo.name?.endsWith('.svg')) {
                return 'assets/icons/[name]-[hash][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            },
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js'
          }
        },
        cssCodeSplit: false,
        assetsInlineLimit: 4096,
        target: ['es2017', 'safari11', 'chrome67', 'firefox60'], // 🚨 COMPATIBILIDAD MEJORADA
        chunkSizeWarningLimit: 1000,
        minify: isDevelopment ? false : 'terser',
        terserOptions: isDevelopment ? {} : {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: false
          }
        },
        sourcemap: isDevelopment,
        reportCompressedSize: !isDevelopment,
        emptyOutDir: true,
        cssMinify: !isDevelopment
      },
      define: {
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
        'import.meta.env.DEV': isDevelopment
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: [
          'react', 
          'react-dom', 
          '@google/genai',
          'react-markdown',
          'remark-gfm'
        ],
        exclude: [],
        // force: isDevelopment // Removido para evitar re-optimización frecuente
      },
      // Development server configuration
      server: {
        headers: isDevelopment ? {
          // 🚨 HEADERS PARA COMPATIBILIDAD MÁXIMA
          'Cross-Origin-Embedder-Policy': 'unsafe-none',
          'Cross-Origin-Opener-Policy': 'unsafe-none',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN'
        } : {
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        compress: !isDevelopment, // Disable compression in development
        fs: {
          strict: false,
          allow: ['..'] // Permitir acceso a archivos fuera del directorio raíz
        },
        // Optimizar HMR para evitar recargas innecesarias
        hmr: {
          overlay: true,
          // Reducir la frecuencia de recargas
          port: 24678,
        },
        // Configuración más estable
        host: '0.0.0.0', // Permitir acceso desde dispositivos móviles
        port: 5173,
        strictPort: false,
        open: false
      },
      // 🚨 CONFIGURACIÓN ESPECÍFICA PARA COMPATIBILIDAD MÁXIMA
      esbuild: {
        target: ['es2017', 'safari11', 'chrome67', 'firefox60']
      }
    };
});
