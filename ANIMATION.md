# G:  Animations

Animate is a JavaScript animation library focusing on performance.

## Getting started

`npm install @mystroken/g` and start animating things:

```javascript
import animate from '@mystroken/g/animate.js';

const anim = animate({
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
animate({
  el: document.body.children,
  p: {
      x: [0, 800, 'px'],
  }
});
```

### p

Determines the element properties to animate.  

| Default         | Type   |
|:--------------- |:------ |
| ```undefined``` | Object |

For performance purposes, you can only animate the opacity and css transformation properties of DOM elements.

```javascript
{
    // Use an array to define the 
    // start value and the end value.
    opacity: [0, 1],
    // You can pass the unit as
    // third element of the Array.
    // For x & y, default unit is '%'
    x: [0, 100, 'px'],
    y: [10, 100],
    scale: [1, 1.5],
    scaleX: [0, 1],
    scaleY: [0, 1],
    // Default unit for rotation is 'deg'
    rotate: [0, 360],
    rotateX: [0, 1, 'turn'],
    // Or simply past a string with unit as end
    // value, the start value will be
    // calculated (less optimized)
    rotateY: "2turn",
}
```

### e

Determines the acceleration curve of your animation (the easing).

| Default | Type               |
|:------- |:------------------ |
| `io4`   | String \| Function |

Except the `linear` easing, all the available easings are composed as follows:

- Choose the acceleration type: 
  
  - `i`: In (accelerated) ;
  
  - `o`: Out (decelerated) ;
  
  - `io`: InOut (accelerated then decelerated).

- Choose the type of the curve: 
  
  - `1`: Sine
  
  - `2`: Quad
  
  - `3`: Cubic
  
  - `4`: Quart
  
  - `5`: Quint
  
  - `6`: Expo

NOTE: you can pass a function if you want to use your own easing function. The function takes the multiplier as its argument and returns a number.

```javascript
animate({
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
animate({
  el: 'span',
  e: 'linear',
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
animate({
  el: 'span',
  e: 'linear',
  delay: index => (index + 1) * 1000,
  p: { opacity: [1, 0] }
});
```

### cb

Defines a callback invoked at the end of the animation.

| Default | Type     |
|:------- |:-------- |
| `null`  | Function |

```javascript
animate({
  el: 'span',
  d: 1000,
  p: { y: [100, 0] },
  cb: () => console.log('The animation is ended !'),
})
```

### update

Defines a callback invoked on every frame of the animation.

| Default | Type     | Params                                |
|:------- |:-------- | ------------------------------------- |
| `null`  | Function | progress, elapsed time, totalDuration |

The callback takes as its argument the animation progress (between 0 and 1) and can be used on its own without being tied to `el`.

```javascript
// Linearly outputs the percentage increase during 5s
animate({
  d: 5000,
  e: 'linear',
  update: (progress, elapsed, duration) =>
    console.log(`Remaining time before the end: ${duration - elapsed}`)
    document.body.textContent = `${Math.round(progress * 100)}%`
});
```

<br>

## Additional functions and properties

### pause()

Pauses the animations on the [elements](#el).

```javascript
// Stop the animation 1s before the end.

const duration = 5000;
const animation = animate({
  el: 'span',
  e: 'io6',
  d: duration,
  p: { rotate: [0, 360] }
});

// Play
animation.play();

// Stop after a certain moment.
setTimeout(() => {
    animation.pause();
}, (duration - 1000));
```

### duration

Returns the real duration of the animation instance (especially useful when you have delayed the animation of selected elements).

```javascript
const animation = animate({ 
  el: 'div',
  delay: index => index * 1000,
  p: { opacity: 1 } 
});

console.log(`The animation will last ${animation.duration} ms`)
```
