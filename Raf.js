/**
 * RAF
 *
 * @example
 *
 * const raf = new G.Raf(loop)
 * raf.run()
 * raf.stop()
 *
 * loop(elapsed) {}
 */

function Raf(loop) {
  this.loop = loop;
  this.raf = null;
  this.startTime = null;
  this.shouldBreakLoop = false;

  // console.log(this._loop);
  this.tick = this.tick.bind(this);
  this.loop = this.loop.bind(this);
}

Raf.prototype.run = function() {
  this.shouldBreakLoop = false;
  this.startTime = 0;//performance.now();
  this.play();
};

Raf.prototype.stop = function() {
  this.shouldBreakLoop = true;
};

Raf.prototype.tick = now => {
  // if (this.shouldBreakLoop) return;
  console.log(this.loop);
  this.loop(this.startTime - now);
  this.play();
};

Raf.prototype.play = function() {
  this.raf = requestAnimationFrame(this.tick);
};

export default Raf;
