var Delay=function(){"use strict";function t(t){this.cb=t,this.rAF=null,this.startTime=null,this.shouldStopTheLoop=!1,this.tick=this.tick.bind(this)}function i(i,o){this.d=o,this.cb=i,this.loop=this.loop.bind(this),this.rAF=new t(this.loop)}return t.prototype.run=function(){this.shouldStopTheLoop=!1,this.startTime=performance.now(),this.rAF=requestAnimationFrame(this.tick)},t.prototype.stop=function(){this.shouldStopTheLoop=!0,cancelAnimationFrame(this.rAF)},t.prototype.tick=function(t){this.shouldStopTheLoop||(this.cb(t-this.startTime),this.rAF=requestAnimationFrame(this.tick))},i.prototype={run:function(){0===this.d?this.cb():this.rAF.run()},stop:function(){this.rAF.stop()},loop:function(t){var i,o,s;(i=t,o=0,s=this.d,Math.min(Math.max(i,o),s))===this.d&&(this.stop(),this.cb())}},i}();
