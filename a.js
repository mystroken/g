import clamp from './clamp';
import Ease from './Ease';
import lerp from './lerp';

/**
 * @typedef InstanceParams
 * @type Object
 * @property {HTMLElement|String|Array} el Determines the elements to animate.
 * @property {Object} p Define element properties to animate.
 * @property {Number|Function} d Determine the duration of each animation.
 * @property {Number|Function} delay Determine the delay of each animation.
 * @property {String|Function} e Determine the ease of animations.
 * @property {Function|null} update Set the callback to call on each frame during animations.
 * @property {Function|null} cb Set the callback to call when animations are done.
 */
/** @var {InstanceParams} defaultParams */
var defaultParams = {
  d: 1000,
  e: "io2",
  delay: 0,
  update: null,
  cb: null
};

// Object helpers

/**
 * Clone an object.
 * @param {Object} o
 * @returns {Object}
 */
function clone(o) {
  var clone = {};
  for (var p in o) clone[p] = o[p];
  return clone;
}

/**
 * Extends an object.
 * @param {Object} o1
 * @param {Object} o2
 * @returns {Object}
 */
function extend(o1, o2) {
  var o = clone(o1);
  for (var p in o2) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  return o;
}

// DOM Helper
function isDOM(element) {
  return (
    element instanceof HTMLElement ||
    element instanceof NodeList ||
    element instanceof HTMLCollection
  );
}

/**
 * Select one or many dom elements (or object)
 * by passing string or their reference
 * and returns an array of these ones.
 *
 * @param {Array|HTMLElement|NodeList|HTMLCollection|string} elements
 * @returns {Array}
 * @see https://developer.mozilla.org/en/docs/Web/API/Element
 */
function selectElements(elements) {
  if (typeof elements === "string")
    return Array.from(document.querySelectorAll(elements));
  if (isDOM(elements)) return Array.from(elements);
  if (Array.isArray(elements)) return elements;

  return [elements];
}

/**
 * Returns a number corresponding to an index.
 * @param {Number|Function} n The stagger amount.
 * @param {Number} i The index in the iterable.
 * @returns {Number} The index's value.
 */
function getStaggerValue(n, i) {
  if (typeof n === "function") return n(i);
  return n;
}

/**
 * Parse the easing and return a
 * function to compute a number according to this easing.
 *
 * @param {String|Function} parameter
 * @returns {Function}
 * @example
 * var eased = parseEasing(parameter)(value);
 */
function parseEasing(parameter) {
  return (typeof parameter === 'string') ? Ease[parameter] : parameter;
}

/**
 * Retrieves value and unit from a given string property.
 * @param {String} property
 * @returns {[Number|null, String|null]}
 */
function parseStringProperty(property) {
  var value = null;
  var unit = null;

  if (typeof property === "string") {
    // Select value.
    var valueMatches = property.match(/\d+/g);
    if (valueMatches) value = valueMatches[0];
    // Select unit.
    var unitMatches = property.match(/\D+/g);
    if (unitMatches) unit = unitMatches[0];
  }

  return [value, unit];
}

/**
 * Parses given properties.
 *
 * Each property is about the start and
 * the end value.
 *
 * We've three ways to create a property
 *  1. By passing an array —> x: [0, 10, 'unit']
 *  2. By passing a string –> y: '100px'
 *  3. By passing a number -> scale: 1
 *
 *  At the end, we need to find properties to this form:
 *  {
 *    x: {
 *      s: 0,
 *      e: 100,
 *      c: 0,
 *      o: {
 *        s: 0,
 *        e: 100
 *      }
 *    }
 *  }
 *
 * @param {Object} p properties to parse.
 * @returns {Object} A parsed form of animatable properties.
 */
function parseProperties(p) {
  var properties = clone(p);

  // Transform some properties if needed.
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

  Object.keys(properties).forEach(function(key){
    var property = properties[key];
    var isPropertyArray = Array.isArray(property);
    var parsedStringProperty = parseStringProperty(property);

    // Retrieve the start and the end value.
    var start = isPropertyArray ? Number(property[0]) : null;
    var end = isPropertyArray
      ? Number(property[1])
      : typeof property === "string"
        ? Number(parsedStringProperty[0])
        : !isNaN(property)
          ? Number(property)
          : null;

    // Retrieve the unit of the value (if needed).
    var unit = isPropertyArray
      ? property[2]
      : typeof property === "string"
        ? parsedStringProperty[1]
        : null;

    properties[key] = {
      s: start,
      c: start,
      e: end,
      u: unit,
      o: {
        s: start,
        e: end
      }
    };
  });

  return properties;
}

/**
 * Returns the transform value of an element.
 * @param {HTMLElement|Object} element The animatable element.
 * @param {String} propertyKey The key name of the property to animate.
 * @returns {Number}
 */
function getElementTransformValue(element, propertyKey) {
  console.log(getComputedStyle(element).getPropertyValue(propertyKey));
}

/**
 * Get the current
 * value of the animation property
 * @param {HTMLElement|Object} element The animatable element.
 * @param {String} animationType The animation type.
 * @param {String} propertyKey The key name of the property to animate.
 * @returns {Number}
 */
function getElementPropertyValue(element, animationType, propertyKey) {
  if (animationType === 'transform') return getElementTransformValue(element, propertyKey);
  const value =
    element.style[propertyKey] ||
    element[propertyKey] ||
    getComputedStyle(element).getPropertyValue(propertyKey);
  return Number(value);
}

/**
 * Detect the animation type from
 * the animatable property key
 *
 * There are three types of animations
 * 'transform', 'opacity', 'object'
 *
 * @param {String} key The property key.
 * @returns {String}
 */
function getAnimationType(key) {
  switch (key) {
    case 'x':
    case 'y':
    case 'scaleX':
    case 'scaleY':
    case 'skewX':
    case 'skewY':
    case 'rotateX':
    case 'rotateY':
      return 'transform';
    case 'opacity':
      return 'opacity';
    default:
      return 'object';
  }
}

/**
 * @typedef AnimatableProperty
 * @type Object
 * @property {String} n The property name.
 * @property {{
 *   s: Number,
 *   c: Number,
 *   e: Number,
 *   o: {s:Number, e:Number}
 * }} v The property values.
 */

/**
 * @typedef {InstanceParams} AnimationParams
 * @property {String} type The animation type.
 */

/**
 * @typedef AnimationInstance
 * @type Object
 * @property {HTMLElement|Object} el The animatable object.
 * @property {String} type The animation type.
 * @property {AnimatableProperty} p Property to animate.
 * @property {{e: String, d: Number, D: Number}} v Animation variables.
 */

/**
 * Create a new animation instance.
 *
 * An animation is responsible of animating
 * the value of one property of a given element.
 * @param {AnimationParams} params
 * @returns {AnimationInstance}
 */
function createNewAnimation(params) {
  function reset() {}

  return {
    el: params.el,
    type: params.type,
    p: params.p,
    v: {
      e: params.e,
      d: params.d,
      D: params.delay
    },
    reset: reset
  };
}

/**
 * Returns an array of animations according
 * to the number of animatable elements and their properties.
 *
 * First of all, we should select and parse properties.
 * Then for each property, we should create an animation instance.
 *
 * @param {Array} elements animatable elements.
 * @param {InstanceParams} params
 * @returns {{l: AnimationInstance[], d: Number}}
 */
function generateAnimations(elements, params) {
  // Since each instance allows to set only the
  // same properties for all selected elements, that
  // means that we can parse properties first
  // before looping through elements.
  var properties = parseProperties(params.p);
  var animations = [];
  var instanceDuration = 0;
  elements.forEach(function(element, index) {
    // For each property of each element,
    // we create an animation.
    // But first, let us compute the
    // duration of the instance.
    var animationDuration = getStaggerValue(params.d, index);
    var animationDelay = getStaggerValue(params.delay, index);
    var animationTotalDuration = animationDelay + animationDuration;
    instanceDuration =
      animationTotalDuration > instanceDuration
      ? animationTotalDuration
      : instanceDuration;
    Object.keys(properties).forEach(function (key) {
      var property = { n: key, v: properties[key] };
      // Get the animation type.
      var animationType = getAnimationType(key);
      var parameters = extend(params, {
        el: element,
        type: animationType,
        p: property,
        d: animationDuration,
        delay: animationDelay
      });
      animations.push(createNewAnimation(parameters));
    });
  });

  return {
    l: animations,
    d: instanceDuration
  };
}

/**
 * @typedef Instance
 * @type Object
 * @property {Number} duration The computed instance duration time.
 * @property {Function} play Play the instance animations.
 * @property {Function} pause Pause the instance animations.
 * @property {Function} _t
 */

/**
 * Creates a new animations manager instance.
 *
 * An animation manager runs many animations
 * according to the number of selected elements
 * and its animatable properties.
 *
 * Typically we should retrieve animatable elements first,
 * Then for each animatable and for each property, we create an animation instance.
 * @param {InstanceParams} parameters
 * @returns {Instance}
 */
function createNewInstance(parameters) {
  var params = extend(defaultParams, parameters);
  var elements = selectElements(params.el);
  var animations = generateAnimations(elements, params);

  return {
    a: animations.l,
    // Variables.
    v: {
      e: params.e,
      el: elements,
      cb: params.cb,
      update: params.update
    },
    // Time variables.
    time: {
      s: null, // Start
      e: 0, // Elapsed
      p: 0, // Progress
      t: animations.d // Total
    }
  };
}

// Core

/** @var {Instance[]} */
var instances = [];
/** @var {Instance[]} */
var runningInstances = [];
var raf;

var runLoop = (function() {

  function play() {
    raf = requestAnimationFrame(step);
  }

  function step() {
    var runningInstancesLength = runningInstances.length;
    if (runningInstancesLength) {
      for (var i=0; i<runningInstancesLength; i++) runningInstances[i]._t();
      play();
    } else {
      raf = cancelAnimationFrame(raf);
    }
  }

  return play;
})();

/**
 * Creates a new instance.
 *
 * Each instance generates animations
 * and knows all about them.
 * @param {InstanceParams} params
 * @returns {Instance}
 */
function animate(params) {
  var instance = createNewInstance(params);

  /**
   * Attach the duration property that
   * exposes the real duration of the instance.
   * var totalDuration = instance.duration;
   */
  Object.defineProperty(instance,
    'duration', {
    get: function () {
      return instance.time.t
    }
  });

  /**
   * Set Animations Progress
   * For each animation of the instance, calculate the
   * progress then set the progress value.
   * @param {Number} time The instance time.
   */
  function setAnimationsProgress(time) {
    var i = 0;
    var animations = instance.a;
    var animationsLength = animations.length;
    while(i < animationsLength) {
      /** @type {AnimationInstance} */
      var animation = animations[i];
      var delay = animation.v.D;
      var duration = animation.v.d;
      var easing = animation.v.e;
      var startTime = delay;
      var stopTime = delay + duration;
      // Start the computation only
      // after the delay
      if (time >= startTime && time <= stopTime) {
        var elapsed = clamp(Number(time - startTime), 0, duration);
        var progress = Number(elapsed / duration).toFixed(4);
        var eased = parseEasing(easing)(progress);
        // Compute the property current value
        // from the progress by using the start and the end values.
        // If the start value is null, that means that we've to retrieve it
        // from CSS.
        animation.p.v.s =
          animation.p.v.s !== null
            ? Number(animation.p.v.s)
            : getElementPropertyValue(
              animation.el,
              animation.type,
              animation.p.n
            );
        var startValue = animation.p.v.s;
        var endValue = animation.p.v.e;
        animation.p.v.c = lerp(startValue, endValue, eased);
        console.log(animation.p);
      }
      i++;
    }
  }

  /**
   * Reset the instance time.
   */
  function resetTime() {
    instance.time.s = null;
    instance.time.e = 0;
    instance.time.p = 0;
  }

  /**
   * Tick
   * @private
   */
  instance._t = function() {
    // 1. Calculate the progress.
    instance.time.s = (instance.time.s === null) ? performance.now() : instance.time.s;
    instance.time.e = clamp(Number(performance.now() - instance.time.s), 0, instance.time.t);
    instance.time.p = Number(instance.time.e / instance.time.t);
    var eased = parseEasing(instance.v.e)(instance.time.p);
    var remainingTime = Number(instance.time.t - instance.time.e);

    // 2. Run all its animations.
    setAnimationsProgress(instance.time.e);
    //instance.a.forEach(function(a){ console.log(a); });

    // 3. Call the update callback.
    instance.v.update && instance.v.update(eased, remainingTime);

    // 4. Pause the instance when we've done.
    if (instance.time.p >= 1) {
      runningInstances.splice(this, 1);
      instance.reset();
      instance.v.cb && instance.v.cb();
    }
  };

  instance.reset = function() {
    instance.paused = true;
    instance.completed = false;
    resetTime();
    // TODO: Reset animation keyframes.
    // Reset animation keyframes.
  };

  instance.play = function() {
    if (!instance.paused) return;
    if (instance.completed) instance.reset();
    instance.paused = false;
    runningInstances.push(instance);
    if (!raf) runLoop();
  };

  instance.pause = function() {
    instance.paused = true;
    // TODO: Reset time.
    // Reset time.
  };

  instance.reset();

  // Register the instance
  instances.push(instance);

  return instance;
}

export default animate;
