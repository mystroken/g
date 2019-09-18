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
loop  #wip
speed #wip
reverse #wip

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

EXAMPLE
───────────────────

this.anim = new Animate({el: '#id', p: {x: [0, 600, 'px']}, d: 2000, e: 'o4'})
this.anim.play()

*/
'use strict';

import bindAll from './bindAll';
import clamp from './clamp';
import Delay from './Delay';
import Ease from './Ease';
import lerp from './lerp';
import Raf from './Raf';
import round from './round';

/**
 * Returns true if it is a DOM node.
 *
 * Result of:
 * querySelector()
 * getElementById()
 *
 * @param {*} o
 */
function isN(o) {
  return o instanceof HTMLElement;
}

/**
 * Returns true if it's a DOM node list.
 *
 * Result of:
 * querySelectorAll()
 * getElementsByClassName()
 * getElementsByTagName()
 *
 * @param {*} o
 */
function isNL(o) {
  return o instanceof NodeList || o instanceof HTMLCollection;
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
function g(elements) {
  if (typeof elements === 'string') return Array.from( document.querySelectorAll(elements) );
  if (isN(elements)) return [elements];
  if (isNL(elements)) return Array.from(elements);
  if (Array.isArray(elements)) return elements;

  return [elements];
}

/**
 * Returns a number corresponding to an index.
 * @param {number|function} n The stagger amount.
 * @param {number} i The index in the iterable.
 * @returns {number} The index's value.
 */
function stagger(n, i) {
  if (typeof n === 'function') return n(i);
  return n;
}

/**
 * Create keyframes from properties.
 * @param {object} properties The animation properties.
 */
function createAnimationKeyframes(properties) {

  var keyframes = {};

  if (properties.scale) {
    properties.scaleX = properties.scale;
    properties.scaleY = properties.scale;
    delete properties.scale;
  }

  if (properties.rotate) {
    properties.rotateX = properties.rotate;
    properties.rotateY = properties.rotate;
    delete properties.rotate;
  }

  Object.keys(properties).forEach(function(key) {

    keyframes[key] = {
      s: properties[key][0], // Start value.
      e: properties[key][1], // End value.
      c: properties[key][0], // Current value.
      // Original start and end.
      o: {
        s: properties[key][0],
        e: properties[key][1],
      },
    };

    // Set property unit.
    if (key !== 'scale' && key !== 'opacity')
      keyframes[key]['u'] =
        (typeof properties[key][2] !== 'undefined')
          ? properties[key][2]
          : (key === 'x' || key === 'y')
            ? '%'
            : 'deg';
  });

  return keyframes;
}

/**
 * Queue data type.
 * @constructor
 */
function L() {
  /**
   * Queue of all animations.
   * @type {Array}
   */
  this.all = [];

  /**
   * Queue length.
   * @type {number}
   */
  this.L = 0;
}

L.prototype = {

  /**
   * Add a new animation to the queue.
   * @param {object} a An animation options.
   * @returns {L}
   */
  a: function(a) {
    this.all.push(a);
    this.L = this.all.length;
    return this;
  },

  /**
   * Remove all items from the queue.
   * @returns {L}
   */
  c: function() {
    this.all.length = 0;
    this.L = 0;
    return this;
  },

  /**
   * Remove an animation from the queue.
   * @param {object} a An animation options.
   * @returns {L}
   */
  d: function(a) {
    this.all.splice(a, 1);
    this.L = this.all.length;
    return this;
  },
};

/**
 * Each element is animated
 * individually
 *
 * @constructor
 */
function AnimationEntry(o) {
  bindAll(this, ['_run', '_tick']);

  // Keep variables.
  this._v = o;

  // The elapsed time since the beginning.
  this._e = 0;

  // The progress of the animation.
  this._p = 0;

  // The loop function.
  this._raf = new Raf(this._tick);

  // Schedule the animation according to the delay.
  this._delay = new Delay(this._run, o.delay);
}

AnimationEntry.prototype = {

  /**
   * Run the animation.
   */
  play: function() {
    this._delay.run();
  },

  /**
   * Pause the animation.
   */
  pause: function() {
    this._raf.stop();
    if (this._delay) this._delay.stop();
  },

  /**
   * Compute the linear interpolation.
   *
   * @param {Number} s
   * @param {Number} e
   * @returns {number}
   * @private
   */
  _li: function(s, e) {
    var ease = (typeof this._v.e === 'string') ? Ease[this._v.e](this._p) : this._v.e(this._p);
    return round(lerp(s, e, ease), 2);
  },

  /**
   * Run the requestAnimationFrame API.
   * @private
   */
  _run: function() {
    this._raf.run();
  },

  /**
   * Create stylesheet from keyframes.
   * @returns {{transform: string, opacity: string}}
   * @private
   */
  _style: function() {
    var
      k = this._v.k,
      s = {
      transform: '',
      opacity: '',
    };

    if (k.x || k.y) {

      var currentX = k.x ? this._li(k.x.s, k.x.e) : 0;
      var currentY = k.y ? this._li(k.y.s, k.y.e) : 0;
      var unit = k.x ? k.x.u : k.y.u;

      s.transform += 'translate3d('+ currentX +''+ unit +', '+ currentY +''+ unit +', 0) ';
    }

    if (k.scaleX) {
      k.scaleX.c = this._li(k.scaleX.s, k.scaleX.e);
      s.transform += 'scaleX('+ k.scaleX.c +') ';
    }

    if (k.scaleY) {
      k.scaleY.c = this._li(k.scaleY.s, k.scaleY.e);
      s.transform += 'scaleY('+ k.scaleY.c +') ';
    }

    if (k.rotateX) {
      k.rotateX.c = this._li(k.rotateX.s, k.rotateX.e);
      s.transform += 'rotateX('+ k.rotateX.c +''+ k.rotateX.u +') ';
    }

    if (k.rotateY) {
      k.rotateY.c = this._li(k.rotateY.s, k.rotateY.e);
      s.transform += 'rotateY('+ k.rotateY.c +''+ k.rotateY.u +') ';
    }

    if (k.opacity) {
      k.opacity.c = this._li(k.opacity.s, k.opacity.e);
      s.opacity = k.opacity.c;
    }

    return s;
  },

  /**
   *
   * @param {number} elapsed The elapsed time.
   * @private
   */
  _tick: function(elapsed) {

    // 1. Calculate the progress
    this._e = clamp(elapsed, 0, this._v.d);
    this._p = clamp(this._e / this._v.d, 0, 1);

    // 2. Apply the ease.
    // this.pE = easing(this.p);

    // 3. Compute values of
    // animated properties


    // 4. Update these properties
    if (this._v.el) {
      // DOM
      if (this._v.type === Animate.TARGET_TYPE.DOM) {
        var s = this._style();
        if (s.transform) this._v.el.style.transform = s.transform;
        if (s.opacity) this._v.el.style.opacity = s.opacity;
      }
      // OBJECT
      else if (this._v.type === Animate.TARGET_TYPE.OBJECT) {
        for (var i in this._v.k) {
          if (this._v.el.hasOwnProperty(i)) {
            this._v.el[i] = this._li(this._v.k[i].s, this._v.k[i].e);
          }
        }
      }
    }

    // 5. Call the update callback
    // by passing the progress as argument
    if (this._v.update) {
      this._v.update(this._p);
    }

    // 6. Break the loop if the
    // animation is complete (progress = 1)
    if (this._p === 1) {
      this.pause();
      if (this._v.cb) this._v.cb();
    }
  },
};



/**
 * Animation manager
 *
 * Split create many animation
 * entries for each animatable.
 *
 * @param {object} o
 * @constructor
 */
function Animate(o) {
  // Bind methods
  // bindAll(this, ['_run', '_tick']);

  /**
   * Register all animation into a stack.
   * @type {L}
   * @private
   */
  this._L = new L();

  /**
   * The elapsed time since the beginning.
   * @type {number}
   * @private
   */
  this._e = 0;

  /**
   * The progress of the animation.
   * @type {number}
   * @private
   */
  this._p = 0;

  /**
   * The loop function.
   * @type {Raf}
   * @private
   */
  this._raf = new Raf(this._tick);

  /**
   * Schedule the animation according to the delay.
   * @type {Delay}
   * @private
   */
  this._delay = new Delay(this._run, o.delay);

  /**
   * Variables.
   * @type {*|{p: *, delay: (*|number), d: (*|number), e: (*|string), el: *, update: (*|boolean), cb: (*|boolean)}}
   * @private
   */
  this._v = this._init(o);
}


/**
 * Animation type
 *
 * Since we can animation dom element
 * and javascript object, we need
 * to know what type of object
 * we're going to animate.
 *
 * @type {{DOM: number, OBJECT: number}}
 */
Animate.TARGET_TYPE = {
  DOM: 0,
  OBJECT: 1
};


Animate.prototype = {
  /**
   * Play the animation.
   */
  play: function() {
    var animations = this._L.all;
    for (var i = 0; i < this._L.L; i++) animations[i].play();
  },

  /**
   * Pause the animation.
   */
  pause: function() {
    var animations = this._L.all;
    for (var i = 0; i < this._L.L; i++) animations[i].pause();
  },

  /**
   * Initialize Move variables.
   * @param o
   * @returns {{p: *, delay: (*|number), d: (*|number), e: (*|string), el: *, update: (*|boolean), cb: (*|boolean)}}
   * @private
   */
  _init: function(o) {

    var v = {
      // Object or DOM elements to animate.
      el: o.el,
      // Elements properties to animate.
      p: o.p,
      // Duration of the animation in ms.
      d: o.d || 1000,
      // Easing of the animation.
      e: o.e || 'io2',
      // Delay before starting.
      delay: o.delay || 0,
      // Callback to call at the end of animation.
      cb: o.cb || false,
      // Callback to call on each animation's frame.
      update: o.update || false,
    };

    // Get the array of elements
    // to animate.
    var elements = g(v.el);
    var length = elements.length;

    // For each element,
    // instantiate a new animation entry.
    for(var i = 0; i < length; i++) {

      // Get the current element.
      var el = elements[i];

      // Extract keyframes.
      var keyframes = createAnimationKeyframes(v.p);

      // Add the animation entry
      // into the queue.
      this._L.a(
        new AnimationEntry({
          el: el,
          d: stagger(v.d, i),
          k: keyframes,
          e: v.e,
          type: isN(el) ? Animate.TARGET_TYPE.DOM : Animate.TARGET_TYPE.OBJECT,
          delay: stagger(v.delay, i),
          cb: v.cb,
          update: v.update,
        })
      );

    }

    return v;
  },

};

export default Animate;
