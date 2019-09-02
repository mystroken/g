# G:  Animations

Animate is a JavaScript animation library focusing on performance.

## Getting started

`npm install @mystroken/g` and start animating things:

```javascript
import Animate from '@mystroken/g/animate.js';

const anim = new Animate({
    // Select the element to animate.
    el: '#loader',
    // Set the animation duration in ms.
    d: 2000,
    // Set properties to animate.
    p: {
        // Fade In the element, opacity from 0 to 1.
        opacity: [0, 100],
        // Move the element on y-axis from 100px to 0px.
        y: [100, 0, 'px'],
    }
});

// Then play the animation anywhere.
anim.play();
```

## Options

### el

Determines the DOM elements to animate. You can either pass it a CSS selector or DOM elements.

| Default     | Type                                   |
|:----------- |:-------------------------------------- |
| `undefined` | String \| Element \| NodeList \| Array |

```javascript
new Animate({
  el: document.body.children,
  p: {
      x: [0, 800, 'px'],
  }
});
```

### e

Determines the acceleration curve of your animation (the easing).

| Default  | Type               |
|:-------- |:------------------ |
| `linear` | String \| Function |

Except the `linear` easing, all the available easings are composed as follows:

- Choose the acceleration type: 
  
  - `i`: In (accelerated) ;
  
  - `o`: Out (decelerated) ;
  
  - `io`: InOut (accelerated then decelerated).

- Choose the type of the curse: 
  
  - `1`: Sine
  
  - `2`: Quad
  
  - `3`: Cubic
  
  - `4`: Quart
  
  - `5`: Quint
  
  - `6`: Expo



NOTE: you can pass a function if you want to use your own easing function. The function takes the multiplier as its argument and returns a number.

```javascript
new Animate({
  el: 'span',
  e: 'io2', // Quad curve - Accelerated then decelerated.
});
```

### d

Determines the duration of your animation in milliseconds.

| Default | Type               |
|:------- |:------------------ |
| `1000`  | Number \| Function |

By passing it a callback, you can define a different duration for each element. The callback takes the index of each element as its argument and returns a number.

```javascript
// First element fades out in 1s, second element in 2s, etc.
new Animate({
  el: "span",
  e: "linear",
  d: index => (index + 1) * 1000,
  p: { opacity: [1, 0] }
});
```

### delay

Determines the delay of your animation in milliseconds.

| Default | Type               |
|:------- |:------------------ |
| `0`     | Number \| Function |

By passing it a callback, you can define a different delay for each element. The callback takes the index of each element as its argument and returns a number.

```javascript
// First element fades out after 1s, second element after 2s, etc.
new Animate({
  el: "span",
  e: "linear",
  delay: index => (index + 1) * 1000,
  p: { opacity: [1, 0] }
});
```

### update

Defines a callback invoked on every frame of the animation.

| Default | Type     |
|:------- |:-------- |
| `null`  | Function |

The callback takes as its argument the animation progress (between 0 and 1) and can be used on its own without being tied to `el`.

```javascript
// Linearly outputs the percentage increase during 5s
new Animate({
  duration: 5000,
  easing: "linear",
  update: progress =>
    document.body.textContent = `${Math.round(progress * 100)}%`
});
```

<br>

## Additional functions

### stop

Stops the animations on the [elements](#el).

```javascript
// Stop the animation 1s before the end.

const duration = 5000;
const animation = new Animate({
  el: "span",
  e: "io6",
  d: duration,
  p: { rotate: [0, 360] }
});

// Play
animation.play();

// Stop after a certain moment.
setTimeout(() => {
    animation.stop();
}, (duration - 1000));
```


