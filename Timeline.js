import forEachIn from "./forEachIn";
import Delay from "./Delay";

function Timeline(params) {
  this.list = [];
  this.length = 0;
  this.d = 0;
  this.cb = params.cb || null;

  this.v = {
    cllBckDly: null
  };

  Object.defineProperty(this, 'duration', {
    get: function() {
      return this.d
    }
  });
}

Timeline.prototype = {

  /**
   * Add an animate or timeline instance .
   * @param {*} animateInstance
   * @param {Number} delay
   */
  add: function(animateInstance, delay) {
    // Clamp the given delay.
    var D = (this.length <= 0) ? 0 : delay ? delay : 0;

    // Compute the new accumulated duration
    // value (The delay value for the current one animation).
    var accumulated = this.d + D;
    if (accumulated < 0) accumulated = 0;

    // Generate the animation delay and add it to registry.
    var d = new Delay(function() { animateInstance.play(); }, accumulated);
    this.list.push({ a: animateInstance, d: d });
    this.length = this.list.length;

    // Set the current total duration of the timeline.
    this.d = accumulated + animateInstance.duration;

    // Schedule the callback.
    if (this.cb !== null) {
      this.v.cllBckDly = null;
      this.v.cllBckDly = new Delay(this.cb, this.d);
    }

    // Return the instance for chaining.
    return this;
  },

  /**
   * Play the timeline.
   */
  play: function() {
    this.v.cllBckDly && this.v.cllBckDly.run();
    forEachIn(this.list)(function (item) {
      item.d.run();
    });
  },

  /**
   * Pause the timeline.
   */
  pause: function() {
    this.v.cllBckDly && this.v.cllBckDly.stop();
    forEachIn(this.list)(function (item) {
      item.d.stop();
      item.a.pause();
    });
  },

  /**
   * Reset the timeline.
   */
  reset: function() {
    this.v.cllBckDly && this.v.cllBckDly.stop();
    forEachIn(this.list)(function (item) {
      item.d.stop();
      item.a.pause();
      item.a.reset();
    });
  },

  /**
   * Stop the timeline.
   */
  stop: function() {
    this.v.cllBckDly && this.v.cllBckDly.stop();
    forEachIn(this.list)(function (item) {
      item.d.stop();
      item.a.pause();
    });
  }
};

export default Timeline;
