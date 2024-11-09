const postcss = require('postcss');
const namespacePixieStyles = require('./scripts/namespace-pixie-styles.plugin');
const safeImportant = require('postcss-safe-important');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    require('tailwindcss'),
    // safeImportant({
    //   decls: ['display','opacity'],
    // }),
    require('autoprefixer'),
    // namespacePixieStyles,
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
