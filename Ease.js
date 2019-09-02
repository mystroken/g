'use strict';
/*
──────────────────────────────────────────
──────────────────────────────────────────
EASE
──────────────────────────────────────────
──────────────────────────────────────────
PROPERTIES
──────────
i           In
o           Out
io          InOut
1           Sine
2           Quad
3           Cubic
4           Quart
5           Quint
6           Expo
USAGE
─────
const eased = Ease['linear'](multiplier);
*/

var Ease = {
  linear: function (t) {
    return t;
  },
  i1: function (t) {
    return -Math.cos(t * (Math.PI / 2)) + 1;
  },
  o1: function (t) {
    return Math.sin(t * (Math.PI / 2));
  },
  io1: function (t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  },
  i2: function (t) {
    return t * t;
  },
  o2: function (t) {
    return t * (2 - t);
  },
  io2: function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  i3: function (t) {
    return t * t * t;
  },
  o3: function (t) {
    return (--t) * t * t + 1;
  },
  io3: function (t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  i4: function (t) {
    return t * t * t * t;
  },
  o4: function (t) {
    return 1 - (--t) * t * t * t;
  },
  io4: function (t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  i5: function (t) {
    return t * t * t * t * t;
  },
  o5: function (t) {
    return 1 + (--t) * t * t * t * t;
  },
  io5: function (t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  },
  i6: function (t) {
    return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
  },
  o6: function (t) {
    return (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);
  },
  io6: function (t) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  }
};

module.exports = Ease;
