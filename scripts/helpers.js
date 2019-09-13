/* eslint-disable */

const fs = require('fs');
const config = require('./common/config.js');
const rollup = require('./common/rollup');

function compileJs(o) {
  rollup({
    env: o.env,
    entry: config.js.entry,
    dest: config.js.dest,
    cb: _ => console.log('JS Compiled !')
  });
}

module.exports = {
  compileJs
};
