import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
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
          'ui-vendor': ['react-markdown', 'remark-gfm'],
          // Router chunks
          'router-vendor': ['react-router-dom'],
          // Stripe chunks
          'stripe-vendor': ['@stripe/react-stripe-js', '@stripe/stripe-js']
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        // Additional optimizations
        dead_code: true,
        // drop_unused: true, // Not supported in current Terser version
        hoist_funs: true,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true
      },
      mangle: {
        safari10: true,
        // More aggressive mangling
        toplevel: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false,
        beautify: false
      }
    },
    sourcemap: false,
    reportCompressedSize: true,
    emptyOutDir: true,
    cssMinify: true
  },
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ]
}); 