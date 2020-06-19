var Timeline=function(){"use strict";function t(t,i){var s=function(t){var i={};for(var s in t)i[s]=t[s];return i}(t);for(var e in i)s[e]=i.hasOwnProperty(e)?i[e]:t[e];return s}function i(t){var i=t.length;return function(s){for(var e=0;e<i;e++)s(t[e],e)}}
/**
   * Timelines are useful to stagger a set animations.
   * @license see /LICENSE
   */function s(t,s){i(t)((function(t){var i=t.i;s?i.stop():i.pause()}))}var e={cb:null,delay:0,update:null};function n(i){this._p=t(e,i),this._q=[],this._t={},this._s={},this._r=null,Object.defineProperty(this,"duration",{get:function(){return Number(this._t.t)}}),this._tick=this._tick.bind(this),this._resetState(),this._resetTime()}return n.prototype={add:function(t,i){var s=function(t,i){var s=t.length,e=s<=0?0:void 0===i?"+=0":i;if("number"==typeof e)return Math.abs(e);var n=e.split("=");if(2!==n.length)return 0;var h=parseInt(n[1]),_=t[s-1].e;return"-"===n[0]?Math.max(0,_-h):_+h}(this._q,i),e=Number(s+t.duration);return this._t.t=e>this._t.t?e:this._t.t,this._q.push(function(t,i,s){return{i:t,s:i,e:s}}(t,s,e)),this},play:function(i){this._s.paused&&!this._s.running&&(this._p="object"==typeof i?t(this._p,i):this._p,this._s.running=!0,this._s.paused=!1,this._s.completed=!1,this._r=requestAnimationFrame(this._tick))},pause:function(){this._s.running&&(s(this._q,!1),this._s.paused=!0,this._s.running=!1,this._freezeTime())},stop:function(){s(this._q,!0),this._resetTime(),this._resetState()},_tick:function(){!this._s.running||this._s.paused||this._s.completed?this._r=cancelAnimationFrame(this._tick):this._runLoop()},_runLoop:function(){var t,s;this._setTime(),t=this._q,0>(s=this._t.e)||i(t)((function(t){var i=t.i,e=t.s,n=t.e;e<=s&&s<n&&i.play()})),this._p.update&&this._t.e>0&&this._p.update(this._t.p,this._t.e,this._t.t),this._t.p>=1&&this._setTheEnd(),this._r=requestAnimationFrame(this._tick)},_setTheEnd:function(){this._s.completed=!0,this._s.paused=!0,this._s.running=!1,s(this._q,!0),this._resetTime(),this._p.cb&&this._p.cb()},_setTime:function(){var t,i,s,e,n,h,_;this._t.s=null===this._t.s?performance.now():this._t.s,this._t.e=(t=this._t,i=this._p.delay,s=t.l,e=performance.now()-t.s,Math.floor(Number(s+e))-Number(i)),this._t.p=Number((n=this._t.e,h=0,_=this._t.t,Math.min(Math.max(n,h),_)/this._t.t))},_resetState:function(){this._s.paused=!0,this._s.completed=!1,this._s.running=!1},_resetTime:function(){this._t.s=null,this._t.e=0,this._t.l=0,this._t.p=0,this._t.t=this._t.t>0?this._t.t:0},_freezeTime:function(){this._t.s=null,this._t.l=this._t.e}},n}();
