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
  /**
   * The callback to call.
   * @type {Function}
   */
  this.cb = loop;

  /**
   * requestAnimationFrame ID
   * @type {*}
   */
  this.r = null;

  /**
   * The start time.
   * @type {*}
   */
  this.s = null;

  /**
   * Is it the end?
   * @type {boolean}
   */
  this.E = false;

  /**
   * Tick
   * @type {FrameRequestCallback}
   * @private
   */
  this._t = this._t.bind(this);
}

/**
 * Start the loop.
 */
Raf.prototype.run = function() {
  this.E = false;
  this.s = window.performance.now();
  this.r = requestAnimationFrame(this._t);
};

/**
 * Break the loop.
 */
Raf.prototype.stop = function() {
  this.E = true;
  cancelAnimationFrame(this.r);
};

/**
 * The tick function.
 * @param {number} t the current time.
 * @private
 */
Raf.prototype._t = function(t) {
  if (this.E) return;
  this.cb(t - this.s);
  this.r = requestAnimationFrame(this._t);
};

export default Raf;
