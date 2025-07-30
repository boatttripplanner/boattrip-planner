export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifyGradients: true,
        minifyParams: true,
        minifySelectors: true,
        mergeLonghand: true,
        mergeRules: true,
        reduceIdents: false,
        reduceInitial: true,
        reduceTransforms: true,
        uniqueSelectors: true,
        zindex: false,
        // Additional aggressive optimizations
        discardEmpty: true,
        discardDuplicates: true,
        discardUnused: true,
        mergeIdents: true,
        reduceIdents: true,
        svgo: true,
        autoprefixer: false // Already handled by autoprefixer plugin
      }]
    } : false
  }
}; 