/**
 * Round
 *
 * Round a number with a p precision
 *
 * @param {Number} n The number to round.
 * @param {Number} p The precision (decimal length). Default 2
 * @returns {number}
 *
 * @example
 *
 * round(4.323)
 * // => 4.32
 *
 * round(4.323, 0)
 * // => 4
 *
 * round(4.383, 1)
 * // => 4.4
 */
function round(n, p) {
  var p = (typeof p === 'undefined') ? 100 : Math.pow(10, p);
  return Math.round(n * p) / p;
}

export default round;
