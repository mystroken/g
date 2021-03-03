var debounce=function(){"use strict";return function(t,e){var n;return function(){var r=this,u=arguments;clearTimeout(n),n=setTimeout(()=>t.apply(r,u),e)}}}();
