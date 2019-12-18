
/**
 * @example
 * const hasTouch = Device.hasTouch;
 */
var Device = {

  get hasTouch() {
    var hasTouchEvent = 'ontouchstart' in document;
	  var hasTouchWinEvent = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
    var hasPointerEvent = !!window.navigator.msPointerEnabled;

    return hasTouchEvent || hasTouchWinEvent || hasPointerEvent;
  },

  get hasMouse() {
    return !this.hasTouch;
  }
};

export default Device;
