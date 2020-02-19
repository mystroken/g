import clone from './clone';

/**
 * Extends an object.
 * @param {Object} o1
 * @param {Object} o2
 * @returns {Object}
 */
export default function extend(o1, o2) {
  var o = clone(o1);
  for (var p in o2) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  return o;
}
