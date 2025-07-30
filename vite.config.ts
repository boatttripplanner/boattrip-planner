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
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
            tryCatchDeoptimization: false
          },
          output: {
            manualChunks: (id) => {
              // Core React chunks
              if (id.includes('react') && id.includes('react-dom')) {
                return 'react-core';
              }
              // Router chunks
              if (id.includes('react-router-dom')) {
                return 'router';
              }
              // AI/ML chunks
              if (id.includes('@google/genai')) {
                return 'ai-services';
              }
              // UI/Markdown chunks
              if (id.includes('react-markdown') || id.includes('remark-gfm')) {
                return 'ui-components';
              }
              // Wizard steps chunks
              if (id.includes('wizard/Step')) {
                return 'wizard-steps';
              }
              // Stripe chunks
              if (id.includes('@stripe')) {
                return 'stripe-vendor';
              }
              // Vendor chunks for other libraries
              if (id.includes('node_modules')) {
                return 'vendor';
              }
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
        target: ['es2020', 'safari11'],
        chunkSizeWarningLimit: 1000,
        minify: isDevelopment ? false : 'terser',
        terserOptions: isDevelopment ? {} : {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,
            // Aggressive optimizations for better compression
            dead_code: true,
            hoist_funs: true,
            hoist_vars: true,
            if_return: true,
            join_vars: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            unused: true,
            collapse_vars: true,
            // drop_unused: true, // Not supported in current Terser version
            evaluate: true,
            inline: true,
            loops: true,
            negate_iife: true,
            properties: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true
          },
          mangle: {
            safari10: true,
            // Aggressive mangling for better compression
            toplevel: true,
            properties: {
              regex: /^_/
            },
            reserved: ['__esModule', 'default']
          },
          format: {
            comments: false,
            beautify: false
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
        force: isDevelopment,
        // Pre-bundle dependencies for faster dev server
        esbuildOptions: {
          target: 'es2020'
        }
      },
      // Development server configuration
      server: {
        headers: isDevelopment ? {} : {
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        compress: !isDevelopment, // Disable compression in development
        fs: {
          strict: false
        },
        // Add proper error handling
        hmr: {
          overlay: true
        }
      },
      // Preview configuration
      preview: {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
        },
        compress: true
      },
      plugins: []
    };
});
