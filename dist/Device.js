var Device=function(){"use strict";return{get hasTouch(){var t="ontouchstart"in document,n=navigator.msMaxTouchPoints&&navigator.msMaxTouchPoints>1,o=!!window.navigator.msPointerEnabled;return t||n||o},get hasMouse(){return!this.hasTouch}}}();