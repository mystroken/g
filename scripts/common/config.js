module.exports = {
  js: {
    entry: './src/*.js',
    dest: {
      cjs: './',
      iife: './dist/',
    },
    watch: './src/',
  },
};
