const watch = require('node-watch');
const config = require('../common/config.js');
const compileJs = require('../helpers').compileJs;

const o = {
  env: 'DEV'
};

compileJs(o);

watch(config.js.watch, { recursive: true }, (evt, filename) => {
  compileJs(o);
});
