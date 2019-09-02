'use strict';
var bindAll = require('./bindAll');
var clamp = require('./clamp');
var Delay = require('./Delay');
var Ease = require('./Ease');
var lerp = require('./lerp');
var Raf = require('./Raf');
var round = require('./round');

/*


──────────────────────────────────────────
──────────────────────────────────────────
Animate
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

TRANSLATION EXAMPLE
───────────────────

this.anim = new Animate({el: '#id', p: {x: [0, 600, 'px']}, d: 2000, e: 'o4'})
this.anim.play()

*/

/**
 * getElements
 *
 * Select one or many dom elements
 * by passing string or their reference
 * and returns an array of dom elements.
 *
 * @param {Array|HTMLElement|HTMLAllCollection|string} elements
 * @returns {Array}
 */
function getElements(elements) {
  if (Array.isArray(elements))
    return elements;
  if (!elements || elements.nodeType)
    return [elements];
  return Array.from(typeof elements === 'string' ? document.querySelectorAll(elements) : elements);
}

/**
 *
 * @param {Object} o The animation options.
 * @constructor
 */
function Animate(o) {
  // Binds context to methods.
  bindAll(this, ['_init', '_run', '_tick']);

  this.e = 0; // elapsed time since the beginning.
  this.p = 0; // progress of the animation.
  this.pE = 0; // progress curve (easing).
  this.delay = null; // timeout function.
  this.raf = new Raf(this._tick); // loop function.
  this.at = null; // animation target (Object|HTML)

  // Get the animations properties.
  this.o = this._init(o);
}

Animate.TARGET_TYPE = {
  DOM: 0,
  OBJECT: 1
};

Animate.prototype = {
  /**
   * _init
   *
   * Initiate the animation.
   * Get the options, then set the
   * animations properties.
   *
   * @param {Object} o The animation options.
   * @returns {{d: (Number), delay: (Number|function), el: (Array), cb: (function|boolean), update: (function|boolean), e: (string|function), p: (Object)}}
   * @private
   */
  _init: function(o) {
    var options = {
      el: getElements(o.el), // DOM elements to animate.
      p: o.p, // Elements properties to animate.
      d: o.d, // Duration of the animation in ms.
      e: o.e || 'io2', // Easing of the animation.
      delay: o.delay || 0, // Delay before starting.
      cb: o.cb || false, // Callback to call at the end of animation.
      update: o.update || false, // Callback to call on each animation's frame.
    };

    // Store the elements length.
    options.eL = options.el.length;

    // Determines the animation target.
    this.at = (Array.isArray(options.el))
      ? Animate.TARGET_TYPE.DOM
      : Animate.TARGET_TYPE.OBJECT;

    // We plan to animate DOM elements.
    if (this.at === Animate.TARGET_TYPE.DOM) {
      var
        translate = {},
        scale = {},
        rotate = {},
        opacity = false
      ;
      options.props = {};

      // x          transform3d → {x: [start, end, unit]} → unit: 'px' for pixel || % if not declared
      // y
      // rotate    rotate(0.5turn) | rotate(540deg)
      // rotateX   rotate3d()
      // rotateY
      // scale      scale(1.4)
      // scaleX
      // scaleY

      // Translation: horizontally.
      if (o.p.x) {
        translate.x = {
          s: o.p.x[0], // Start value.
          e: o.p.x[1], // End value.
          c: o.p.x[0], // Current value.
          u: o.p.x[2] || '%', // Value unit.
          // Original start and end.
          o: {
            s: o.p.x[0],
            e: o.p.x[1],
          },
        };
      }
      // Translation: vertically.
      if (o.p.y) {
        translate.y = {
          s: o.p.y[0], // Start value.
          e: o.p.y[1], // End value.
          c: o.p.y[0], // Current value.
          u: o.p.y[2] || '%', // Value unit.
          // Original start and end.
          o: {
            s: o.p.y[0],
            e: o.p.y[1],
          },
        };
      }
      options.props.translate = translate;

      // Scaling
      if (o.p.scale) {
        o.p.scaleX = o.p.scale;
        o.p.scaleY = o.p.scale;
      }
      // X
      if (o.p.scaleX) {
        scale.x = {
          s: o.p.scaleX[0], // Start value.
          e: o.p.scaleX[1], // End value.
          c: o.p.scaleX[0], // Current value.
          // Original start and end.
          o: {
            s: o.p.scaleX[0],
            e: o.p.scaleX[1],
          },
        };
      }
      // Y
      if (o.p.scaleY) {
        scale.y = {
          s: o.p.scaleY[0], // Start value.
          e: o.p.scaleY[1], // End value.
          c: o.p.scaleY[0], // Current value.
          // Original start and end.
          o: {
            s: o.p.scaleY[0],
            e: o.p.scaleY[1],
          },
        };
      }
      options.props.scale = scale;

      // Rotation
      if (o.p.rotate) {
        o.p.rotateX = o.p.rotate;
        o.p.rotateY = o.p.rotate;
      }
      // X
      if (o.p.rotateX) {
        rotate.x = {
          s: o.p.rotateX[0], // Start value.
          e: o.p.rotateX[1], // End value.
          c: o.p.rotateX[0], // Current value.
          u: o.p.y[2] || 'deg', // Value unit.
          // Original start and end.
          o: {
            s: o.p.rotateX[0],
            e: o.p.rotateX[1],
          },
        };
      }
      // Y
      if (o.p.rotateY) {
        rotate.y = {
          s: o.p.rotateY[0], // Start value.
          e: o.p.rotateY[1], // End value.
          c: o.p.rotateY[0], // Current value.
          u: o.p.y[2] || 'deg', // Value unit.
          // Original start and end.
          o: {
            s: o.p.rotateY[0],
            e: o.p.rotateY[1],
          },
        };
      }
      options.props.rotate = rotate;

      // Opacity
      if (o.p.opacity) {
        opacity = {
          s: o.p.opacity[0], // Start value.
          e: o.p.opacity[1], // End value.
          c: o.p.opacity[0], // Current value.
          // Original start and end.
          o: {
            s: o.p.opacity[0],
            e: o.p.opacity[1],
          },
        };
      }
      options.props.opacity = opacity;
    }

    // Schedule the animation according to the delay.
    this.delay = new Delay(this._run, options.delay);

    // Returns the object when we've done.
    return options;
  },

  /**
   * play
   *
   * Start the animation.
   */
  play: function() {
    this.pause();
    this.delay.run();
  },

  /**
   * pause
   *
   * Pause/Stop the animation.
   */
  pause: function() {
    this.raf.stop();
    if (this.delay) this.delay.stop();
  },

  /**
   * _run
   *
   * Start the animation loop.
   *
   * @private
   */
  _run: function() {
    this.raf.run();
  },

  /**
   * Called on each frame.
   *
   * @param {Number} elapsed The elapsed time.
   */
  _tick: function(elapsed) {

    // 1. Calculate the progress
    this.e = clamp(elapsed, 0, this.o.d);
    this.p = clamp(this.e / this.o.d, 0, 1);

    // 2. Apply the ease.
    // this.pE = easing(this.p);

    // 3. Compute values of
    // animated properties
    var props = this.o.props;
    var _s = {
      transform: ''
    }; // Style.

    // If we're trying to animate DOM elements.
    if (this.at === Animate.TARGET_TYPE.DOM) {
      // When we're animating HTML,
      // we either deal with transform, or opacity.
      if (props.translate.x) {
        props.translate.x.c = this._lerp(props.translate.x.s, props.translate.x.e);
        _s.transform += 'translateX('+ props.translate.x.c +''+ props.translate.x.u +') ';
        _s.transform += 'translateZ(0) ';
      }
      if (props.translate.y) {
        props.translate.y.c = this._lerp(props.translate.y.s, props.translate.y.e);
        _s.transform += 'translateY('+ props.translate.y.c +''+ props.translate.y.u +')';
        _s.transform += 'translateZ(0) ';
      }
      if (props.scale.x) {
        props.scale.x.c = this._lerp(props.scale.x.s, props.scale.x.e);
        _s.transform += 'scaleX('+ props.scale.x.c +') ';
      }
      if (props.scale.y) {
        props.scale.y.c = this._lerp(props.scale.y.s, props.scale.y.e);
        _s.transform += 'scaleY('+ props.scale.y.c +') ';
      }
      if (props.rotate.x) {
        props.rotate.x.c = this._lerp(props.rotate.x.s, props.rotate.x.e);
        _s.transform += 'rotateX('+ props.rotate.x.c +''+ props.rotate.x.u +') ';
      }
      if (props.rotate.y) {
        props.rotate.y.c = this._lerp(props.rotate.y.s, props.rotate.y.e);
        _s.transform += 'rotateY('+ props.rotate.y.c +''+ props.rotate.y.u +') ';
      }
      if (props.opacity) {
        props.opacity.c = this._lerp(props.opacity.s, props.opacity.e);
        _s.opacity = props.opacity.c;
      }

    }
    // Else if we're trying to animate an object properties.
    else if (this.at === Animate.TARGET_TYPE.OBJECT) {}

    // 4. Update these properties
    this.o.el.forEach(function(element) {
      element.style.opacity = _s.opacity;
      element.style.transform = _s.transform;
    });

    // 5. Call the update callback
    // by passing the progress as argument
    if (this.o.update) this.o.update(this.p);

    // 6. Break the loop if the
    // animation is complete (progress = 1)
    if (this.p === 1) {
      this.pause();
      if (this.o.cb) this.o.cb();
    }
  },

  /**
   * Compute the linear interpolation.
   *
   * @param {Number} s
   * @param {Number} e
   * @returns {number}
   * @private
   */
  _lerp: function(s, e) {
    var ease = (typeof this.o.e === 'string') ? Ease[this.o.e](this.p) : this.o.e(this.p);
    return round(lerp(s, e, ease), 2);
  },
};

module.exports = Animate;
