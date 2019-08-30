'use strict';
var Raf = require('./Raf');
var clamp = require('./clamp');

/**
 *
 * An optimized implementation
 * of window.setTimeout
 *
 * @param {Function} cb The callback to call after the delay.
 * @param {Number} d The duration, in ms, of the delay.
 * @returns {void}
 * @example
 *
 * const d = 2000;
 * const cb = () => console.log(`Call me ${d}ms later`);
 *
 * const delay = new Delay(cb, d);
 * delay.run();
 * delay.stop();
 *
 */
function Delay(cb, d) {
  this.d = d;
  this.cb = cb;
  this.loop = this.loop.bind(this);
  this.rAF = new Raf(this.loop);
}

Delay.prototype = {

  run: function() {
    if (this.d === 0) this.cb();
    else this.rAF.run();
  },

  stop: function() {
    this.rAF.stop();
  },

  loop: function(e) {
    var elapsed = clamp(e, 0, this.d);
    if (elapsed === this.d) {
      this.stop();
      this.cb();
    }
  },
};

module.exports = Delay;
