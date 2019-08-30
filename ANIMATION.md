# G:  Animations

Animate is a JavaScript animation library focusing on performance and authoring flexibility.

## Getting started

`npm install @mystroken/g` and start animating things:

```javascript
import Animate from '@mystroken/g/animate.js';

new Animate({
  elements: 'div',
  duration: 2000,
  delay: index => index * 100,
  properties: {
      x: [0, 800, 'px'],
      opacity: [0, 1],
  }
});
```

## Options

### elements

| Default | Type                                   |
|:------- |:-------------------------------------- |
| `null`  | String \| Element \| NodeList \| Array |

Determines the DOM elements to animate. You can either pass it a CSS selector or DOM elements.

```javascript
new Animate({
  elements: document.body.children,
  properties: {
      x: [0, 800, 'px'],
  }
});
```

### easing

| Default       | Type   |
|:------------- |:------ |
| `out-elastic` | String |

Determines the acceleration curve of your animation.

| constant | accelerate     | decelerate      | accelerate-decelerate |
|:-------- |:-------------- |:--------------- |:--------------------- |
| linear   | in-cubic       | out-cubic       | in-out-cubic          |
|          | in-quartic     | out-quartic     | in-out-quartic        |
|          | in-quintic     | out-quintic     | in-out-quintic        |
|          | in-exponential | out-exponential | in-out-exponential    |
|          | in-circular    | out-circular    | in-out-circular       |
|          | in-elastic     | out-elastic     | in-out-elastic        |

The amplitude and period of elastic easings can be configured by providing space-separated values.
Amplitude defaults to `1`, period to `0.4`.

```javascript
// Increase elasticity
new Animate({
  elements: "span",
  easing: "out-elastic 1.4 0.2",
});
```

### duration

| Default | Type               |
|:------- |:------------------ |
| `1000`  | Number \| Function |

Determines the duration of your animation in milliseconds. By passing it a callback, you can define
a different duration for each element. The callback takes the index of each element as its argument
and returns a number.

```javascript
// First element fades out in 1s, second element in 2s, etc.
animate({
  elements: "span",
  easing: "linear",
  duration: index => (index + 1) * 1000,
  opacity: [1, 0]
});
```

### delay

| Default | Type               |
|:------- |:------------------ |
| `0`     | Number \| Function |

Determines the delay of your animation in milliseconds. By passing it a callback, you can define
a different delay for each element. The callback takes the index of each element as its argument
and returns a number.

```javascript
// First element fades out after 1s, second element after 2s, etc.
animate({
  elements: "span",
  easing: "linear",
  delay: index => (index + 1) * 1000,
  opacity: [1, 0]
});
```

### update

| Default | Type     |
|:------- |:-------- |
| `null`  | Function |

Defines a callback invoked on every frame of the animation. The callback takes as its argument the animation progress (between 0 and 1) and can be used on its own without being tied to `elements`.

```javascript
// Linearly outputs the percentage increase during 5s
animate({
  duration: 5000,
  easing: "linear",
  change: progress =>
    document.body.textContent = `${Math.round(progress * 100)}%`
});
```

## Animations

Animate Plus lets you animate HTML and SVG elements with any property that takes numeric values,
including hexadecimal colors.

```javascript
// Animate the radius and fill color of an SVG circle
animate({
  elements: "circle",
  r: [0, 50],
  fill: ["#80f", "#fc0"]
});
```

Each property you animate needs an array defining the start and end values. For convenience, you can
omit everything but the numbers in the end values.

```javascript
// Same as ["translate(0px)", "translate(100px)"]
animate({
  elements: "span",
  transform: ["translate(0px)", 100]
});
```

These arrays can optionally be returned by a callback that takes the index of each element, just
like with [duration](#duration) and [delay](#delay).

```javascript
// First element translates by 100px, second element by 200px, etc.
animate({
  elements: "span",
  transform: index => ["translate(0px)", (index + 1) * 100]
});
```

## Additional functions

### stop

Stops the animations on the [elements](#elements) passed as the argument.

```javascript
import {stop} from "/animateplus.js";

animate({
  elements: "span",
  easing: "linear",
  duration: index => 8000 + index * 200,
  loop: true,
  transform: ["rotate(0deg)", 360]
});

document.addEventListener("click", ({target}) => stop(target));
```

[Preview this example &#8594;](http://animateplus.com/examples/stop/)

### delay

Sets a timer in milliseconds. It differentiates from `setTimeout()` by returning a promise and being
more accurate, consistent and battery-friendly. The [delay](#delay) option relies internally on
this method.

```javascript
import {delay} from "/animateplus.js";

delay(500).then(time => console.log(`${time}ms elapsed`));
```
