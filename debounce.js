/**
 * Debouncing is a pattern that allows
 * delaying execution of some piece of code until
 * a specified time to avoid unnecessary
 * CPU cycles, API calls and improve performance.
 *
 * @param {Function} fn
 * @param {Number} delay
 * @returns {Function}
 */
function debounce(fn, delay) {
  var timer;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(context, args), delay);
  };
}

export default debounce;
