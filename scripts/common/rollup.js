const path = require('path');
const globby = require('globby');
const rollup = require('rollup');
const filesize = require('rollup-plugin-filesize');
const commonjs = require('rollup-plugin-commonjs'); // Solve problems of node modules import
const resolve = require('rollup-plugin-node-resolve'); // Solve problems of node modules import
const terser = require('rollup-plugin-terser').terser;

module.exports = o => {
  const production = o.env === 'PROD';

  // Rollup plugins
  const plugins = [
    resolve(), // support modules from node_modules.
    commonjs({
      include: './src/**'
    }), // support of require.
  ];

  if (production) {
    // minification
    plugins.push(terser());
    plugins.push(filesize())
  }

  // Rollup
  const configs = globby.sync(o.entry).map(inputFile => {
    const file = path.parse(inputFile);
    const { base, name } = file;

    return ({
      entry: inputFile,
      output: {
        cjs: path.join(o.dest.cjs, base),
        iife: path.join(o.dest.iife, base)
      },
      name: name === 'index' ? 'G' : name,
    })
  });
  const L = configs.length;

  configs.forEach((c, i) => {
    rollup
      .rollup({
        input: c.entry,
        plugins
      })
      .then(bundle => {
        // IIFE Export
        bundle
          .write({
            file: c.output.iife,
            format: 'iife',
            name: c.name
          })
        ;

        // CJS Export
        bundle
          .write({
            file: c.output.cjs,
            format: 'cjs'
          })
          .then(() => {
            if (i === (L-1)) o.cb();
          })
        ;
      })
    ;
  });
};
