/**
 * Array.prototype.forEach custom implementation.
 * @param {Array} arr
 * @returns {Function}
 */
function forEachIn(arr) {
  var arrLength = arr.length;
  return function(fn) {
    for (var i = 0; i < arrLength; i++) fn(arr[i]);
  }
}

export default forEachIn;
