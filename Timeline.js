/**
 * Timelines are useful to stagger a set animations.
 * @license see /LICENSE
 */

import clamp from './clamp';
import extend from './extend';
import forEachIn from './forEachIn';
import Raf from './Raf';

/**
 * @typedef AnimationInstance
 * @type Object
 * @property {Function} play Run the animation instance.
 * @property {Function} pause Pause the animation instance.
 * @property {Function} stop Stop the animation instance.
 * @property {Number} duration The duration of the animation instance.
 * @see animate.js
 */

/**
 * @typedef TimelineTime
 * @type Object
 * @property {Number|null} s The start time of the timeline.
 * @property {Number} e The elapsed time of the timeline.
 * @property {Number} t The total time of the timeline.
 * @property {Number} l The last frozen time.
 * @property {Number} p The progression amount.
 */

/**
 * @typedef TimelineState
 * @type Object
 * @property {Boolean} paused The timeline is paused or not.
 * @property {Boolean} running The timeline is running or not.
 * @property {Boolean} completed The timeline is completed or not.
 */

/**
 * @typedef TimelineParameters
 * @type Object
 * @property {Number|null} delay Determines the delay before the timeline starts running animations.
 * @property {Function|null} update Defines a function invoked on every frame of the timeline.
 * @property {Function|null} cb Defines a function invoked at the end of the timeline.
 */

/**
 * @typedef TimelineQueueElement
 * @type Object
 * @property {AnimationInstance} i The animation instance.
 * @property {Number} s The start time in the queue.
 * @property {Number} e The end time in the queue.
 */

/**
 * Pause or Stop the timeline animations.
 * @param {[TimelineQueueElement]} queueElements
 * @param {Boolean} reset Reset animations after pause.
 */
function pauseTimelineAnimations(queueElements, reset) {
  forEachIn(queueElements)(function(element) {
    var animation = element.i;
    if (reset) animation.stop();
    else animation.pause();
  });
}

/**
 * Run animations that are ready.
 * @param {[TimelineQueueElement]} queue
 * @param {Number} time
 */
function runTimelineAnimationsAtTime(queue, time) {
  forEachIn(queue)(function(element) {
    var animation = element.i;
    var startTime = element.s;
    if (startTime >= time) animation.play();
  });
}

/**
 * Determine where to place the animation in the timeline.
 * We place an animation in the
 * timeline either absolutely or relatively.
 * @param {[TimelineQueueElement]} queue
 * @param {String|Number=} offset
 * @returns {Number}
 */
function computeAnimationStartTimeInTimeline(queue, offset) {
  var queueLength = queue.length;
  var o = ( queueLength <= 0 ) ? 0
    : (typeof offset === 'undefined') ? '+=0' : offset;

  // If it is an absolute placement.
  if (typeof o === 'number') return Math.abs(o);

  // It is a relative placement.
  var offsetOperators = o.split('=');
  if (offsetOperators.length !== 2 ) return 0;
  var operationValue = parseInt(offsetOperators[1]);
  var previousElementEndTime = queue[queueLength - 1].e;
  return (offsetOperators[0] === '-')
    ? Math.max(0, previousElementEndTime - operationValue)
    : previousElementEndTime + operationValue;
}

/**
 * Compute and return the elapsed time.
 * @param {TimelineTime} time
 * @returns {Number}
 */
function getTimelineElapsedTime(time) {
  // Get the last elapsed
  // time (store when we pause the instance for example)
  var lastElapsed = time.l;
  // Compute the current elapsed time.
  var elapsed = performance.now() - time.s;
  // The new elapsed time is
  // the accumulation of all the previous elapsed time.
  return Number(lastElapsed + elapsed);
}

/**
 * Generate a timeline queue element.
 * @param {AnimationInstance} animation The animation instance.
 * @param {Number} start The start time in the queue.
 * @param {Number} end The end time in the queue.
 */
function generateTimelineQueueElement(animation, start, end) {
  return { i: animation, s: start, e: end };
}

/**
 * @type {TimelineParameters}
 */
var defaultTimelineParameters = {
  cb: null,
  delay: 0,
  update: null
};

/**
 * Timeline instance.
 * @param {TimelineParameters=} params The timeline parameters.
 */
function Timeline(params) {
  /**
   * Timeline Parameters
   * @type {TimelineParameters}
   * @private
   */
  this._p = extend(defaultTimelineParameters, params);

  /**
   * Timeline Queue
   * @type {[TimelineQueueElement]}
   * @private
   */
  this._q = [];

  /**
   * Timeline Time
   * @type {TimelineTime}
   * @private
   */
  this._t = {};

  /**
   * Timeline State
   * @type {TimelineState}
   * @private
   */
  this._s = {};

  /**
   * requestAnimationFrame Interface.
   * @type {Raf}
   * @private
   */
  this._tick = this._tick.bind(this);
  this._r = new Raf(this._tick);

  // Define the
  // duration property.
  Object.defineProperty(this, 'duration', {
    get: function() {
      return Number(this._t.e - this._t.s);
    }
  });

  this._resetState();
  this._resetTime();
 }

Timeline.prototype = {
  /**
   * Add an animation to the timeline.
   * @param {AnimationInstance} animation
   * @param {String|Number=} offset Offset of the animation.
   * @returns {this}
   */
  add: function(animation, offset) {
    // Process
    // Compute the start time
    // Compute the end time.
    // Compute the timeline total time.
    // Add animation to the queue.

    var startTime = computeAnimationStartTimeInTimeline(this._q, offset);
    var endTime = Number(startTime + animation.duration);
    // If the current end
    // time, is higher than the
    // total timeline time, then this value
    // is the new total time.
    this._t.t = (endTime > this._t.t) ? endTime : this._t.t;
    this._q.push(generateTimelineQueueElement(animation, startTime, endTime));
    return this;
  },

  /**
   * Play the timeline.
   * @param {TimelineParameters=} params The timeline parameters.
   * TODO: Consider the new passed delay when we hit play to resume a timeline.
   */
  play: function(params) {
    if (!this._s.paused || this._s.completed) return;
    // Process (only if paused and not completed)
    // Set (Override) timeline parameters.
    // Run the loop.
    // Set the timeline state to running.

    this._p = (typeof params === 'object') ? extend(this._p, params) : this._p;
    this._r.run();
    this._s.running = true;
    this._s.paused = false;
  },

  /**
   * Pause the timeline.
   */
  pause: function() {
    if (!this._s.running) return;
    // Process (only if running)
    // Break the loop.
    // Pause all running animations.
    // Freeze the timeline time.
    // Set the timeline state to paused.

    this._r.stop();
    pauseTimelineAnimations(this._q, false);
    this._freezeTime();
    this._s.paused = true;
    this._s.running = false;
  },

  /**
   * Stop the timeline.
   */
  stop: function() {
    // Process
    // Break the loop.
    // Stop all animations (running or not).
    // Reset the timeline time.
    // Reset the state (paused, not completed and not running).

    this._r.stop();
    pauseTimelineAnimations(this._q, true);
    this._resetTime();
    this._resetState();
  },

  /**
   * The timeline loop.
   * @private
   */
  _tick: function() {
    // Process
    // Set the timeline time (progression).
    // Play ready animations.
    // Check the end of the timeline.

    this._setTime();
    runTimelineAnimationsAtTime(this._q, this._t.e);
    if (this._p.update) this._p.update(this._t.p, this._t.e, this._t.t);
    if (this._t.p >= 1) {
      this._s.completed = true;
      this._s.paused = true;
      this._s.running = false;
      if (this._p.cb) this._p.cb();
      this._r.stop();
    }
  },

  /**
   * Reset the timeline state.
   */
  _resetState: function() {
    this._s.paused = true;
    this._s.completed = false;
    this._s.running = false;
  },

  _setTime: function() {
    this._t.s = (this._t.s === null) ? performance.now() : this._t.s;
    this._t.e = clamp(getTimelineElapsedTime(this._t), 0, this._t.t);
    this._t.p = Number(this._t.e / this._t.t);
  },

  /**
   * Reset the timeline time.
   * @private
   */
  _resetTime: function() {
    this._t.s = null;
    this._t.e = 0;
    this._t.l = 0;
    this._t.p = 0;
    this._t.t = (this._t.t > 0) ? this._t.t : 0;
  },

  /**
   * Freeze the timeline time.
   * @private
   */
  _freezeTime: function() {
    this._t.s = null;
    this._t.l = this._t.e;
  }
};

export default Timeline;
