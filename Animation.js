'use strict';
var clamp = require('./clamp');
var Raf = require('./Raf');
var Delay = require('./Delay');
var bindAll = require('./bindAll');
var lerp = require('./lerp');
var round = require('./round');

var easing = function (m) {
  return m < 0.5 ? 2 * m * m : -1 + (4 - 2 * m) * m;
};

/*


──────────────────────────────────────────
──────────────────────────────────────────
Animation
──────────────────────────────────────────
──────────────────────────────────────────

OBJECT
──────

elements            elements
properties          properties
duration            duration
easing              easing
delay               delay
callback            callback to call at the end.
update              custom function called on each frame
loop
speed
reverse

PROPERTIES
──────────

x                   transform3d → {x: [start, end, unit]} → unit: 'px' for pixel || % if not declared
y
rotate
rotateX
rotateY
scale
scaleX
scaleY
opacity

SVG
───

type                'polygon' or 'path' (path to improve)
start               optional
end

LINE
────

elWL                optional → elWithLength → The total length of the line is calculated with him if he's present (example: folio dodecagon)
dashed              '1,4' or false
start               percentage → default: 0
end                 percentage → default: 100

TRANSLATION EXAMPLE
───────────────────

this.anim = new Animation({elements: '#id', properties: {x: [0, 600, 'px']}, duration: 2000, easing: 'o4'})
this.anim.play()

*/

/**
 *
 * @param {Object} o The animation options.
 * @constructor
 */
function Animation(o) {
  // Binds context to methods.
  bindAll(this, ['init', 'run', 'tick']);

  // Instantiate my variables.
  this.elapsed = 0;
  this.progress = 0;
  this.delay = null;
  this.raf = new Raf(this.tick);

  // Get the animations configurations.
  this.o = this.init(o);
}

Animation.prototype = {
  /**
   * Init animation options.
   *
   * @param {Object} o
   * @returns {{duration: *, delay: (*|number), elements: *, callback: (*|boolean), update: *, easing: *, properties: *}}
   */
  init: function(o) {
    var options = {
      elements: o.elements,
      properties: o.properties,
      duration: o.duration,
      easing: o.easing,
      delay: o.delay || 0,
      callback: o.callback || false,
      update: o.update || null,
    };

    // Store the elements length.
    options.eL = o.elements.length;

    // Set the delay.
    this.delay = new Delay(this.run, o.delay);

    return options;
  },

  play: function() {
    this.pause();
    this.delay.run();
  },

  pause: function() {
    this.raf.stop();
    if (this.delay) this.delay.stop();
  },

  run: function() {
    this.raf.run();
  },

  /**
   * Called on each frame.
   *
   * @param {Number} elapsed The elapsed time.
   */
  tick: function(elapsed) {
    // Get the progress &
    // Check if we've done or not.
    this.elapsed = clamp(elapsed, 0, this.o.duration);
    this.progress = clamp(this.elapsed / this.o.duration, 0, 1);

    // Calculate the current properties to animate.
    var easing = 0;
    var value = this.lerp(100, 0);

    // Update the animated elements.
    this.o.elements.style.transform = 'translateY(' + value +'px)';
    this.o.elements.style.opacity = this.progress.toFixed(2);

    // Call the update callback.
    if (this.o.update) this.o.update(this.progress);

    // If we've done, stop the loop and call the callback.
    if (this.progress === 1) {
      this.pause();
      if (this.o.callback) this.o.callback();
    }
  },

  lerp: function(s, e) {
    return round(lerp(s, e, easing(this.progress)), 2);
  },
};

module.exports = Animation;
