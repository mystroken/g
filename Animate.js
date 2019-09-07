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
 * Returns true if it is a DOM node.
 *
 * querySelector()
 *
 * @param {*} o
 */
function isNode(o) {
  return o instanceof HTMLElement;
}

/**
 * Returns true if it's a DOM node list.
 *
 * Result of:
 * querySelectorAll()
 *
 * @param {*} o
 */
function isNodeList(o) {
  return o instanceof NodeList;
}

/**
 * Returns true if it is a DOM element.
 *
 * Result of:
 * getElementById()
 *
 * @param {*} o
 */
function isElement(o) {
  return o instanceof HTMLElement;
}

/**
 * Returns true if it is a DOM element collection.
 *
 * Result of:
 * getElementsByClassName()
 * getElementsByTagName()
 *
 * @param {*} o
 */
function isElementCollection(o) {
  return o instanceof HTMLCollection;
}

/**
 * getElements
 *
 * Select one or many dom elements
 * by passing string or their reference
 * and returns an array of dom elements.
 *
 * @param {Array|HTMLElement|NodeList|HTMLCollection|string} elements
 * @returns {Array|object}
 * @see https://developer.mozilla.org/en/docs/Web/API/Element
 */
function getElements(elements) {
  if (typeof elements === 'string')
    return Array.from( document.querySelectorAll(elements) );
  if (isNode(elements) || isElement(elements))
    return [elements];
  if (isNodeList(elements) || isElementCollection(elements))
    return Array.from(elements);
  if (Array.isArray(elements))
    return elements;
  return elements;
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

      options.props = {};

      if (o.p.scale) {
        o.p.scaleX = o.p.scale;
        o.p.scaleY = o.p.scale;
        delete o.p.scale;
      }

      if (o.p.rotate) {
        o.p.rotateX = o.p.rotate;
        o.p.rotateY = o.p.rotate;
        delete o.p.rotate;
      }

      Object.keys(o.p).forEach(function(i) {

        options.props[i] = {
          s: o.p[i][0], // Start value.
          e: o.p[i][1], // End value.
          c: o.p[i][0], // Current value.
          // Original start and end.
          o: {
            s: o.p[i][0],
            e: o.p[i][1],
          },
        };

        // Set property unit.
        if (i !== 'scale' && i !== 'opacity')
          options.props[i]['u'] = o.p[i][2] || (i==='x' || i==='y') ? '%' : 'deg';
      });

    }
    else if(this.at === Animate.TARGET_TYPE.OBJECT) {
      options.props = {};
      var keys = Object.keys(o.p);

      keys.forEach(function(i) {
        options.props[i] = {
          s: o.p[i][0], // Start value.
          e: o.p[i][1], // End value.
          c: o.p[i][0], // Current value.
          // Original start and end.
          o: {
            s: o.p[i][0],
            e: o.p[i][1],
          },
        };
      });

      // Properties length.
      options.props.pL = keys.length;
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
      if (props.x) {
        props.x.c = this._lerp(props.x.s, props.x.e);
        _s.transform += 'translateX('+ props.x.c +''+ props.x.u +') ';
        _s.transform += 'translateZ(0) ';
      }
      if (props.y) {
        props.y.c = this._lerp(props.y.s, props.y.e);
        _s.transform += 'translateY('+ props.y.c +''+ props.y.u +')';
        _s.transform += 'translateZ(0) ';
      }
      if (props.scaleX) {
        props.scaleX.c = this._lerp(props.scaleX.s, props.scaleX.e);
        _s.transform += 'scaleX('+ props.scaleX.c +') ';
      }
      if (props.scaleY) {
        props.scaleY.c = this._lerp(props.scaleY.s, props.scaleY.e);
        _s.transform += 'scaleY('+ props.scaleY.c +') ';
      }
      if (props.rotateX) {
        props.rotateX.c = this._lerp(props.rotateX.s, props.rotateX.e);
        _s.transform += 'rotateX('+ props.rotateX.c +''+ props.rotateX.u +') ';
      }
      if (props.rotateY) {
        props.rotateY.c = this._lerp(props.rotateY.s, props.rotateY.e);
        _s.transform += 'rotateY('+ props.rotateY.c +''+ props.rotateY.u +') ';
      }
      if (props.opacity) {
        props.opacity.c = this._lerp(props.opacity.s, props.opacity.e);
        _s.opacity = props.opacity.c;
      }

    }
    // Else if we're trying to animate an object properties.
    else if (this.at === Animate.TARGET_TYPE.OBJECT) {
      for (var i in props) {
        if (this.o.el.hasOwnProperty(i)) {
          this.o.el[i] = this._lerp(props[i].s, props[i].e);
        }
      }
    }

    // 4. Update these properties
    (this.at === Animate.TARGET_TYPE.DOM) && this.o.el.forEach(function(element) {
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
