
/**
 * Clone an object.
 * @param {Object} o
 * @returns {Object}
 */
export default function clone(o) {
  var clone = {};
  for (var p in o) clone[p] = o[p];
  return clone;
}
