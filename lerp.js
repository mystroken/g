/**
 * Linear interpolation
 *
 * Interpolates from start to end using the given fraction.
 *
 * @param {Number} s The min value.
 * @param {Number} e The max value.
 * @param {Number} f The fraction (from 0 to 1)
 * @returns {Number}
 * @example
 *
 * Lerp(start, end, fraction);
 */
function lerp(s, e, f) {
  return (e - s) * f + s;
}

export default lerp;
