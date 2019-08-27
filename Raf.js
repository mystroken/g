'use strict';

/**
 * RequestAnimationFrame Interface.
 *
 * @param {Function} loop The function to call in a loop.
 * @example
 *
 * const raf = new Raf(loop)
 * raf.run()
 * raf.stop()
 *
 * const loop = elapsed => console.log(elapsed)
 */
function Raf(loop) {
  this.cb = loop;
  this.rAF = null;
  this.startTime = 0;

  this.tick = this.tick.bind(this);
}

Raf.prototype.run = function() {
  this.startTime = performance.now();
  this.rAF = requestAnimationFrame(this.tick);
};

Raf.prototype.stop = function() {
  cancelAnimationFrame(this.rAF);
};

Raf.prototype.tick = function(now) {
  this.cb(now - this.startTime);
  this.rAF = requestAnimationFrame(this.tick);
};


module.exports = Raf;
