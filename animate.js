import clamp from './clamp';
import Ease from './Ease';
import lerp from './lerp';
import round from './round';

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
  e: "io4",
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

/**
 * Check if an element is contained inside a given array.
 * @param {Array} anArray
 * @param {*} element
 * @returns {boolean}
 */
function arrayContains(anArray, element) {
  if (Array.isArray(anArray)) {
    var i = 0;
    var arrayLength = anArray.length;
    while (i < arrayLength) {
      if (element === anArray[i++])
        return true;
    }
  }
  return false;
}

// DOM Helper
/**
 * Check if the passed element is a DOM element
 * @param {Object|HTMLElement|HTMLCollection|NodeList|String} element
 * @returns {boolean}
 */
function isDOM(element) {
  return element instanceof HTMLElement;
}

/**
 * Check if the passed elements is a collection of DOM Elements.
 * @param {Object|HTMLElement|HTMLCollection|NodeList|String} element
 * @returns {boolean}
 */
function isDOMList(element) {
  return (
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
  if (isDOM(elements))
    return [elements];
  if (isDOMList(elements))
    return Array.from(elements);
  if (Array.isArray(elements))
    return elements;
  if (typeof elements === "string")
    return Array.from(document.querySelectorAll(elements));

  return [elements];
}

/**
 * Returns a number corresponding to an index.
 * @param {Number|Function} n The stagger amount.
 * @param {Number} i The index in the iterable.
 * @returns {Number} The index's value.
 */
function getStaggerValue(n, i) {
  return (typeof n === "function") ? n(i) : n;
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
  property = "" + property;

  // Select value.
  var valueMatches = property.match(/[^a-zA-Z]+/g);
  if (valueMatches) value = valueMatches[0];
  // Select unit.
  var unitMatches = property.match(/[a-zA-Z]+/g);
  if (unitMatches) unit = unitMatches[0];

  return [value, unit];
}

/**
 * If the passed unit is defined, returns it
 * Else try to return a default unit according to passed property.
 * @param {String} propertyKey
 * @param {undefined|String} unit
 * @returns {null|String}
 */
function getPropertyUnit(propertyKey, unit) {
  if (unit) return unit;
  switch (propertyKey) {
    case 'translateX':
    case 'translateY':
    case 'translateZ':
      return '%';
    case 'rotate':
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
      return 'deg';
    default:
      return null;
  }
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

  if (properties.x) {
    properties.translateX = properties.x;
    delete properties.x;
  }

  if (properties.y) {
    properties.translateX = properties.x;
    delete properties.y;
  }

  if (properties.z) {
    properties.translateZ = properties.z;
    delete properties.z;
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
      ? getPropertyUnit(key, property[2])
      : typeof property === "string"
        ? parsedStringProperty[1]
        : getPropertyUnit(key);

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

  // Typically here I've to try reading
  // the value from the style attribute first,
  // if there is no value there, I can call the getComputedStyle then :'(
  var transformationStyleString = element.style.transform;
  if (!transformationStyleString) {
    // It seems like getComputedStyle returns
    // either the string "none"
    // or the computed transformation in the form of a matrix.
    //var computedTransformValue = getComputedStyle(element).getPropertyValue("transform");
    if (arrayContains(["scale", "scaleX", "scaleY"], propertyKey)) return 1;
  } else {
    // We're reading value from element style attribute.
    // If we found the property inside the string, we get value.
    // EDIT: (Ignore) Else, we try to look for the group property and we remove the value there.
    // Else, we're definitely sure that the value is not set and we return 0.
    var values = transformationStyleString.match(new RegExp(propertyKey + "\(([^)]+)\)"));
    return Array.isArray(values) && values[1]
      ? parseStringProperty(values[1].substr(1))[0]
      : arrayContains(["scale", "scaleX", "scaleY"], propertyKey) ? 1 : 0;
  }

  return 0;
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
  if (animationType === 'transform')
    return getElementTransformValue(element, propertyKey);
  const value =
    element.style[propertyKey] ||
    element[propertyKey] ||
    getComputedStyle(element).getPropertyValue(propertyKey);
  return Number(value);
}

/**
 * Set a value to the transformation property.
 * @param {HTMLElement|Object} element The animatable element.
 * @param {String} propertyKey The property to set the value.
 * @param {String} value The value to set.
 */
function setElementTransformValue(element, propertyKey, value) {
  // We're trying to do a transformation.
  // First of all, we should take the current transformation string.
  // If the current transformation property key already exist in the string, we just have to replace its value.
  // Else we create a new string and we add it in the transformation string.
  var transformationString = element.style.transform;
  element.style.transform =
    transformationString.indexOf(propertyKey) !== -1
      ? transformationString.replace(new RegExp(propertyKey + "\(([^)]+)\)"), propertyKey + "("+value)
      : transformationString + " " + propertyKey + "("+value+")"
  ;
}

/**
 * Set animatable element a value.
 * @param {HTMLElement|Object} element The animatable element.
 * @param {String} animationType The animation type.
 * @param {String} propertyKey The property to set the value.
 * @param {String} value The value to set.
 * @param {String} unit The unit of the property.
 */
function setElementValue(element, animationType, propertyKey, value, unit) {
  switch (animationType) {
    case "object": element[propertyKey] = value;break;
    case "opacity": element.style["opacity"] = value;break;
    case "transform":
      var transformValue = unit ? value+""+unit : value;
      setElementTransformValue(element, propertyKey, transformValue);
      break;
  }
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
    case 'translateX':
    case 'translateY':
    case 'translateZ':
    case 'scale':
    case 'scaleX':
    case 'scaleY':
    case 'scaleZ':
    case 'skew':
    case 'skewX':
    case 'skewY':
    case 'skewZ':
    case 'rotate':
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
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
  var animation = {
    el: params.el,
    type: params.type,
    p: params.p,
    v: {
      e: params.e,
      d: params.d,
      D: params.delay
    }
  };

  /**
   * Reset the animation.
   */
  animation.reset = function() {
    // Reset keyframes.
    animation.p.v.s = animation.p.v.o.s;
    animation.p.v.e = animation.p.v.o.e;
    animation.p.v.c = animation.p.v.o.s;
  };

  return animation;
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
    // EDIT: For more control, I need to group transformation animations into one animation.
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
 * @property {Number} id The instance id.
 * @property {Number} duration The computed instance duration time.
 * @property {Boolean} paused
 * @property {Boolean} completed
 * @property {Function} play Play the instance animations.
 * @property {Function} pause Pause the instance animations.
 * @property {Function} _t
 */

var instanceId = 0;
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
    id: instanceId++,
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
      l: 0, // Last elapsed
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
var runningInstancesLength = 0;
var raf;

/**
 * Add an instance to running list
 * @param {Instance} instance
 */
function addInstanceToRunningList(instance) {
  runningInstances.push(instance);
  runningInstancesLength = runningInstances.length;
}

/**
 * Remove an instance from the running list.
 * @param {Instance|Number} instance
 */
function removeInstanceFromRunningList(instance) {
  runningInstances.splice(instance, 1);
  runningInstancesLength = runningInstances.length;
}

// Core
// The Engine.
var runLoop = (function() {

  function play() {
    raf = requestAnimationFrame(step);
  }

  function step() {
    if (runningInstancesLength) {
      for (var i=0; i<runningInstancesLength; i++) {
        /**
         * Run the instance only when it is
         * not paused and not completed.
         * Else remove it from the running list.
         */
        var runningInstance = runningInstances[i];
        if (!runningInstance.paused && !runningInstance.completed) {
          runningInstance._t();
        } else {
          removeInstanceFromRunningList(i);
        }
      }
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
        animation.p.v.c = round(lerp(startValue, endValue, eased), 4);
        // Set animation value.
        setElementValue(animation.el, animation.type, animation.p.n, animation.p.v.c, animation.p.v.u);
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
    instance.time.l = 0;
    instance.time.p = 0;
  }

  /**
   * Freeze the animation time.
   */
  function freezeTime() {
    instance.time.s = null;
    instance.time.l = instance.time.e;
  }

  /**
   * Compute and return the elapsed time.
   * @returns {Number}
   */
  function getTheInstanceElapsedTime() {
    // Get the last elapsed
    // time (store when we pause the instance for example)
    var lastElapsed = instance.time.l;
    // Compute the current elapsed time.
    var elapsed = performance.now() - instance.time.s;
    // The new elapsed time is
    // the accumulation of all the previous elapsed time.
    return Number(lastElapsed + elapsed);
  }

  /**
   * Tick
   * @private
   */
  instance._t = function() {
    // 1. Calculate the progress.
    instance.time.s = (instance.time.s === null) ? performance.now() : instance.time.s;
    instance.time.e = clamp(getTheInstanceElapsedTime(), 0, instance.time.t);
    instance.time.p = Number(instance.time.e / instance.time.t);
    var eased = parseEasing(instance.v.e)(instance.time.p);

    // 2. Run all its animations.
    setAnimationsProgress(instance.time.e);

    // 3. Call the update callback.
    instance.v.update &&
      instance.v.update(eased, instance.time.e, instance.time.t);

    // 4. Pause the instance when we've done.
    if (instance.time.p >= 1) {
      instance.paused = true;
      instance.completed = true;
      instance.v.cb && instance.v.cb();
    }
  };

  instance.reset = function() {
    instance.paused = true;
    instance.completed = false;
    resetTime();
    // Reset animation keyframes.
    var animations = instance.a;
    var animationLength = animations.length;
    for (var i=0; i<animationLength; i++) animations[i].reset();
  };

  instance.play = function() {
    if (!instance.paused) return;
    if (instance.completed) instance.reset();
    instance.paused = false;

    addInstanceToRunningList(this);
    if (!raf) runLoop();
  };

  /**
   * Pause an instance.
   * Typically we should freeze the time then
   * we have to remove the instance from runningInstances list.
   */
  instance.pause = function() {
    instance.paused = true;
    freezeTime();
  };

  instance.reset();
  // Register the instance
  instances.push(instance);
  return instance;
}

export default animate;
