'use strict';

/**
 * Bind a context to some methods.
 *
 * @param {*} c The context to bind.
 * @param {Array} a Array of methods to attach context to.
 *
 * @example
 *
 * BindAll(this, ['bindFunction1', 'bindFunction2']);
 *
 */
function bindAll(c, a) {
  var arrL = a.length;

  for (var i = 0; i < arrL; i++) {
      c[a[i]] = c[a[i]].bind(c);
  }
}

module.exports = bindAll;
