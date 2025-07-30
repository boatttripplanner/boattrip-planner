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
            moduleSideEffects: true,
            propertyReadSideEffects: true,
            unknownGlobalSideEffects: true,
            tryCatchDeoptimization: true
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
              // Return undefined for other modules to let Rollup handle them
              return undefined;
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
            passes: 1,
            // Less aggressive optimizations to prevent runtime errors
            dead_code: true,
            hoist_funs: false,
            hoist_vars: false,
            if_return: true,
            join_vars: true,
            reduce_vars: false,
            sequences: true,
            side_effects: false,
            unused: false,
            collapse_vars: false,
            evaluate: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            unsafe: false,
            unsafe_comps: false,
            unsafe_Function: false,
            unsafe_math: false,
            unsafe_methods: false,
            unsafe_proto: false,
            unsafe_regexp: false,
            unsafe_undefined: false
          },
          mangle: {
            safari10: true,
            // Less aggressive mangling to prevent property access issues
            toplevel: false,
            properties: false,
            reserved: ['__esModule', 'default', 'exports', 'module']
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
