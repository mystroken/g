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

  a.forEach(function(f) {
    c[f] = c[f].bind(c);
  });

}

export default bindAll;
