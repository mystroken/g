var a=function(){"use strict";var t={d:1e3,e:"io4",delay:0,update:null,cb:null};function n(t){var n={};for(var e in t)n[e]=t[e];return n}function e(t,e){var r=n(t);for(var i in e)r[i]=e.hasOwnProperty(i)?e[i]:t[i];return r}function r(t){return"string"==typeof t?Array.from(document.querySelectorAll(t)):(n=t)instanceof HTMLElement||n instanceof NodeList||n instanceof HTMLCollection?Array.from(t):Array.isArray(t)?t:[t];var n}function i(t,n){return"function"==typeof t?t(n):t}function a(t,r){var a=function(t){var e=n(t);return e.scale&&(e.scaleX=e.scale,e.scaleY=e.scale,delete e.scale),e.rotate&&(e.rotateX=e.rotate,e.rotateY=e.rotate,delete e.rotate),Object.keys(e).forEach((function(t){var n=e[t],r=Array.isArray(n),i=function(t){var n=null,e=null;if("string"==typeof t){var r=t.match(/\d+/g);r&&(n=r[0]);var i=t.match(/\D+/g);i&&(e=i[0])}return[n,e]}(n),a=r?Number(n[0]):null,o=r?Number(n[1]):"string"==typeof n?Number(i[0]):isNaN(n)?null:Number(n),u=r?n[2]:"string"==typeof n?i[1]:null;e[t]={s:a,c:a,e:o,u:u,o:{s:a,e:o}}})),e}(r.p),o=(function(t){}(r.e),[]),u=0;return t.forEach((function(t,n){var c=i(r.d,n),s=i(r.delay,n),l=s+c;u=l>u?l:u,Object.keys(a).forEach((function(n){var i={n:n,v:a[n]},u=e(r,{el:t,p:i,d:c,delay:s});o.push(function(t){return{el:t.el,p:t.p,play:function(){},pause:function(){},reset:function(){}}}(u))}))})),{l:o,d:u}}var o,u=[],c=function(){function t(){o=requestAnimationFrame(n)}function n(){u.length?(u.forEach((function(t){t._t()})),t()):o=cancelAnimationFrame(o)}return t}();return function(n){var i=function(n){var i=e(t,n),o=a(r(i.el),i);return{o:i,a:o.l,time:{s:null,e:0,p:0,t:o.d}}}(n);return i.play=function(){u.push(this),o||c()},i.pause=function(){},i._t=function(){var t,n,e;this.time.s=null===this.time.s?performance.now():this.time.s,this.time.e=(t=Number(performance.now()-this.time.s),n=0,e=this.time.t,Math.min(Math.max(t,n),e)),this.time.p=Number(this.time.e/this.time.t),this.time.p>=1&&u.splice(this,1)},i}}();
