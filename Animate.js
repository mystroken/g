"use strict";function bindAll(t,e){e.forEach((function(e){t[e]=t[e].bind(t)}))}function clamp(t,e,i){return Math.min(Math.max(t,e),i)}function Raf(t){this.cb=t,this.rAF=null,this.startTime=null,this.shouldStopTheLoop=!1,this.tick=this.tick.bind(this)}function Delay(t,e){this.d=e,this.cb=t,this.loop=this.loop.bind(this),this.rAF=new Raf(this.loop)}Raf.prototype.run=function(){this.shouldStopTheLoop=!1,this.startTime=performance.now(),this.rAF=requestAnimationFrame(this.tick)},Raf.prototype.stop=function(){this.shouldStopTheLoop=!0,cancelAnimationFrame(this.rAF)},Raf.prototype.tick=function(t){this.shouldStopTheLoop||(this.cb(t-this.startTime),this.rAF=requestAnimationFrame(this.tick))},Delay.prototype={run:function(){0===this.d?this.cb():this.rAF.run()},stop:function(){this.rAF.stop()},loop:function(t){clamp(t,0,this.d)===this.d&&(this.stop(),this.cb())}};var Ease={linear:function(t){return t},i1:function(t){return 1-Math.cos(t*(Math.PI/2))},o1:function(t){return Math.sin(t*(Math.PI/2))},io1:function(t){return-.5*(Math.cos(Math.PI*t)-1)},i2:function(t){return t*t},o2:function(t){return t*(2-t)},io2:function(t){return t<.5?2*t*t:(4-2*t)*t-1},i3:function(t){return t*t*t},o3:function(t){return--t*t*t+1},io3:function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},i4:function(t){return t*t*t*t},o4:function(t){return 1- --t*t*t*t},io4:function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},i5:function(t){return t*t*t*t*t},o5:function(t){return 1+--t*t*t*t*t},io5:function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t},i6:function(t){return 0===t?0:Math.pow(2,10*(t-1))},o6:function(t){return 1===t?1:1-Math.pow(2,-10*t)},io6:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*--t))}};function lerp(t,e,i){return(e-t)*i+t}function round(t,e){e=void 0===e?100:Math.pow(10,e);return Math.round(t*e)/e}function isNode(t){return t instanceof HTMLElement}function isNodeList(t){return t instanceof NodeList}function isElement(t){return t instanceof HTMLElement}function isElementCollection(t){return t instanceof HTMLCollection}function getElements(t){return"string"==typeof t?Array.from(document.querySelectorAll(t)):isNode(t)||isElement(t)?[t]:isNodeList(t)||isElementCollection(t)?Array.from(t):(Array.isArray(t),t)}function Animate(t){bindAll(this,["_init","_run","_tick"]),this.e=0,this.p=0,this.pE=0,this.delay=null,this.raf=new Raf(this._tick),this.at=null,this.o=this._init(t)}Animate.TARGET_TYPE={DOM:0,OBJECT:1},Animate.prototype={_init:function(t){var e={el:getElements(t.el),p:t.p,d:t.d||1e3,e:t.e||"io2",delay:t.delay||0,cb:t.cb||!1,update:t.update||!1};if(e.eL=e.el.length,this.at=Array.isArray(e.el)?Animate.TARGET_TYPE.DOM:Animate.TARGET_TYPE.OBJECT,this.at===Animate.TARGET_TYPE.DOM)e.props={},t.p.scale&&(t.p.scaleX=t.p.scale,t.p.scaleY=t.p.scale,delete t.p.scale),t.p.rotate&&(t.p.rotateX=t.p.rotate,t.p.rotateY=t.p.rotate,delete t.p.rotate),Object.keys(t.p).forEach((function(i){e.props[i]={s:t.p[i][0],e:t.p[i][1],c:t.p[i][0],o:{s:t.p[i][0],e:t.p[i][1]}},"scale"!==i&&"opacity"!==i&&(e.props[i].u=t.p[i][2]||"x"===i||"y"===i?"%":"deg")}));else if(this.at===Animate.TARGET_TYPE.OBJECT){e.props={};var i=Object.keys(t.p);i.forEach((function(i){e.props[i]={s:t.p[i][0],e:t.p[i][1],c:t.p[i][0],o:{s:t.p[i][0],e:t.p[i][1]}}})),e.props.pL=i.length}return this.delay=new Delay(this._run,e.delay),e},play:function(){this.pause(),this.delay.run()},pause:function(){this.raf.stop(),this.delay&&this.delay.stop()},_run:function(){this.raf.run()},_tick:function(t){this.e=clamp(t,0,this.o.d),this.p=clamp(this.e/this.o.d,0,1);var e=this.o.props,i={transform:""};if(this.at===Animate.TARGET_TYPE.DOM)e.x&&(e.x.c=this._lerp(e.x.s,e.x.e),i.transform+="translateX("+e.x.c+e.x.u+") ",i.transform+="translateZ(0) "),e.y&&(e.y.c=this._lerp(e.y.s,e.y.e),i.transform+="translateY("+e.y.c+e.y.u+")",i.transform+="translateZ(0) "),e.scaleX&&(e.scaleX.c=this._lerp(e.scaleX.s,e.scaleX.e),i.transform+="scaleX("+e.scaleX.c+") "),e.scaleY&&(e.scaleY.c=this._lerp(e.scaleY.s,e.scaleY.e),i.transform+="scaleY("+e.scaleY.c+") "),e.rotateX&&(e.rotateX.c=this._lerp(e.rotateX.s,e.rotateX.e),i.transform+="rotateX("+e.rotateX.c+e.rotateX.u+") "),e.rotateY&&(e.rotateY.c=this._lerp(e.rotateY.s,e.rotateY.e),i.transform+="rotateY("+e.rotateY.c+e.rotateY.u+") "),e.opacity&&(e.opacity.c=this._lerp(e.opacity.s,e.opacity.e),i.opacity=e.opacity.c);else if(this.at===Animate.TARGET_TYPE.OBJECT)for(var n in e)this.o.el.hasOwnProperty(n)&&(this.o.el[n]=this._lerp(e[n].s,e[n].e));this.at===Animate.TARGET_TYPE.DOM&&this.o.el.forEach((function(t){t.style.opacity=i.opacity,t.style.transform=i.transform})),this.o.update&&this.o.update(this.p),1===this.p&&(this.pause(),this.o.cb&&this.o.cb())},_lerp:function(t,e){return round(lerp(t,e,"string"==typeof this.o.e?Ease[this.o.e](this.p):this.o.e(this.p)),2)}},module.exports=Animate;
