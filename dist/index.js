var G=function(){"use strict";function t(t,e){e.forEach((function(e){t[e]=t[e].bind(t)}))}function e(t,e,s){return Math.min(Math.max(t,e),s)}function s(t){this.cb=t,this.r=null,this.s=null,this.E=!1,this._t=this._t.bind(this)}function i(t,e){this.d=e,this.cb=t,this.loop=this.loop.bind(this),this.rAF=new s(this.loop)}s.prototype.run=function(){this.E=!1,this.s=performance.now(),this.r=requestAnimationFrame(this._t)},s.prototype.stop=function(){this.E=!0,cancelAnimationFrame(this.r)},s.prototype._t=function(t){this.E||(this.cb(t-this.s),this.r=requestAnimationFrame(this._t))},i.prototype={run:function(){0===this.d?this.cb():this.rAF.run()},stop:function(){this.rAF.stop()},loop:function(t){e(t,0,this.d)===this.d&&(this.stop(),this.cb())}};var r={linear:function(t){return t},i1:function(t){return 1-Math.cos(t*(Math.PI/2))},o1:function(t){return Math.sin(t*(Math.PI/2))},io1:function(t){return-.5*(Math.cos(Math.PI*t)-1)},i2:function(t){return t*t},o2:function(t){return t*(2-t)},io2:function(t){return t<.5?2*t*t:(4-2*t)*t-1},i3:function(t){return t*t*t},o3:function(t){return--t*t*t+1},io3:function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},i4:function(t){return t*t*t*t},o4:function(t){return 1- --t*t*t*t},io4:function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},i5:function(t){return t*t*t*t*t},o5:function(t){return 1+--t*t*t*t*t},io5:function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t},i6:function(t){return 0===t?0:Math.pow(2,10*(t-1))},o6:function(t){return 1===t?1:1-Math.pow(2,-10*t)},io6:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*--t))}};function n(t,e,s){return(e-t)*s+t}function o(t){return"string"==typeof t?Array.from(document.querySelectorAll(t)):t instanceof HTMLElement||function(t){return t instanceof HTMLElement}(t)?[t]:function(t){return t instanceof NodeList}(t)||function(t){return t instanceof HTMLCollection}(t)?Array.from(t):(Array.isArray(t),t)}function a(e){t(this,["_run","_tick"]),this.v={el:e.el,t:e.t,d:e.d,p:e.p,delay:e.delay},this.e=0,this.p=0,this.pE=0,this.rAF=new s(this._tick),this.delay=new i(this._run,e.delay)}function c(e){t(this,["_init","_run","_tick"]),this.e=0,this.p=0,this.pE=0,this.delay=null,this.raf=new s(this._tick),this.at=null,this.entries=[],this.o=this._init(e)}return a.prototype={play:function(){this.pause(),this.delay.run()},pause:function(){this.rAF.stop(),this.delay&&this.delay.stop()},_run:function(){this.rAF.run()},_tick:function(t){this.e=e(t,0,this.v.d),this.p=e(this.e/this.v.d,0,1);var s=this.v.p,i={transform:""};if(this.v.t===c.TARGET_TYPE.DOM)s.x&&(s.x.c=this._lerp(s.x.s,s.x.e),i.transform+="translateX("+s.x.c+s.x.u+") ",i.transform+="translateZ(0) "),s.y&&(s.y.c=this._lerp(s.y.s,s.y.e),i.transform+="translateY("+s.y.c+s.y.u+")",i.transform+="translateZ(0) "),s.scaleX&&(s.scaleX.c=this._lerp(s.scaleX.s,s.scaleX.e),i.transform+="scaleX("+s.scaleX.c+") "),s.scaleY&&(s.scaleY.c=this._lerp(s.scaleY.s,s.scaleY.e),i.transform+="scaleY("+s.scaleY.c+") "),s.rotateX&&(s.rotateX.c=this._lerp(s.rotateX.s,s.rotateX.e),i.transform+="rotateX("+s.rotateX.c+s.rotateX.u+") "),s.rotateY&&(s.rotateY.c=this._lerp(s.rotateY.s,s.rotateY.e),i.transform+="rotateY("+s.rotateY.c+s.rotateY.u+") "),s.opacity&&(s.opacity.c=this._lerp(s.opacity.s,s.opacity.e),i.opacity=s.opacity.c);else if(this.v.t===c.TARGET_TYPE.OBJECT)for(var r in s)this.v.el.hasOwnProperty(r)&&(this.v.el[r]=this._lerp(s[r].s,s[r].e));this.v.t===c.TARGET_TYPE.DOM&&(this.v.el.style.opacity=i.opacity,this.v.el.style.transform=i.transform)}},c.TARGET_TYPE={DOM:0,OBJECT:1},c.prototype={_init:function(t){var e={el:o(t.el),p:t.p,d:t.d||1e3,e:t.e||"io2",delay:t.delay||0,cb:t.cb||!1,update:t.update||!1};if(e.eL=e.el.length,this.at=Array.isArray(e.el)?c.TARGET_TYPE.DOM:c.TARGET_TYPE.OBJECT,this.at===c.TARGET_TYPE.DOM)e.props={},t.p.scale&&(t.p.scaleX=t.p.scale,t.p.scaleY=t.p.scale,delete t.p.scale),t.p.rotate&&(t.p.rotateX=t.p.rotate,t.p.rotateY=t.p.rotate,delete t.p.rotate),Object.keys(t.p).forEach((function(s){e.props[s]={s:t.p[s][0],e:t.p[s][1],c:t.p[s][0],o:{s:t.p[s][0],e:t.p[s][1]}},"scale"!==s&&"opacity"!==s&&(e.props[s].u=t.p[s][2]||"x"===s||"y"===s?"%":"deg")}));else if(this.at===c.TARGET_TYPE.OBJECT){e.props={};var s=Object.keys(t.p);s.forEach((function(s){e.props[s]={s:t.p[s][0],e:t.p[s][1],c:t.p[s][0],o:{s:t.p[s][0],e:t.p[s][1]}}})),e.props.pL=s.length}return this.at===c.TARGET_TYPE.DOM&&e.el.forEach((function(e){this.entries.push(new a({el:e,t:c.TARGET_TYPE.DOM,d:t.d,p:t.p,delay:t.delay}))})),this.delay=new i(this._run,e.delay),e},play:function(){this.pause(),this.delay.run()},pause:function(){this.raf.stop(),this.delay&&this.delay.stop()},_run:function(){this.raf.run()},_tick:function(t){this.e=e(t,0,this.o.d),this.p=e(this.e/this.o.d,0,1);var s=this.o.props,i={transform:""};if(this.at===c.TARGET_TYPE.DOM)s.x&&(s.x.c=this._lerp(s.x.s,s.x.e),i.transform+="translateX("+s.x.c+s.x.u+") ",i.transform+="translateZ(0) "),s.y&&(s.y.c=this._lerp(s.y.s,s.y.e),i.transform+="translateY("+s.y.c+s.y.u+")",i.transform+="translateZ(0) "),s.scaleX&&(s.scaleX.c=this._lerp(s.scaleX.s,s.scaleX.e),i.transform+="scaleX("+s.scaleX.c+") "),s.scaleY&&(s.scaleY.c=this._lerp(s.scaleY.s,s.scaleY.e),i.transform+="scaleY("+s.scaleY.c+") "),s.rotateX&&(s.rotateX.c=this._lerp(s.rotateX.s,s.rotateX.e),i.transform+="rotateX("+s.rotateX.c+s.rotateX.u+") "),s.rotateY&&(s.rotateY.c=this._lerp(s.rotateY.s,s.rotateY.e),i.transform+="rotateY("+s.rotateY.c+s.rotateY.u+") "),s.opacity&&(s.opacity.c=this._lerp(s.opacity.s,s.opacity.e),i.opacity=s.opacity.c);else if(this.at===c.TARGET_TYPE.OBJECT)for(var r in s)this.o.el.hasOwnProperty(r)&&(this.o.el[r]=this._lerp(s[r].s,s[r].e));this.at===c.TARGET_TYPE.DOM&&this.o.el.forEach((function(t){t.style.opacity=i.opacity,t.style.transform=i.transform})),this.o.update&&this.o.update(this.p),1===this.p&&(this.pause(),this.o.cb&&this.o.cb())},_lerp:function(t,e){var s,i,o="string"==typeof this.o.e?r[this.o.e](this.p):this.o.e(this.p);return s=n(t,e,o),i=void 0===(i=2)?100:Math.pow(10,i),Math.round(s*i)/i}},{Animate:c,bindAll:t,clamp:e,Delay:i,Ease:r,lerp:n,Raf:s}}();
