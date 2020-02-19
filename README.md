# G

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/mystroken/g/issues)

> :hibiscus::leaves: G is a garden of small JavaScript utilities.

<br>

## Installation

```bash
npm install @mystroken/g
```

<br>

## Usage

Look at the sources files for more information.

###### Import

```javascript
// Import the whole library.
import G from '@mystroken/g';

// OR import individual helper - like lodash he he ;-)
import Raf from '@mystroken/g/Raf'; 
```

###### Create a 60FPS loop.

```javascript
const rAF = new Raf(elapsed => console.log(elapsed));
rAF.run();
```

###### Call a func after a certain delay.

```javascript
const duration = 2000;
const callback = () => console.log(`Call me ${duration}ms later`);
const delay = new G.Delay(callback, duration);
delay.run();
```

###### Animate things

```javascript
const anim = animate({
    el: '#loader', // Select the element to animate.
    d: 2000, // Set the animation duration in ms.
    // Set properties to animate.
    p: {
        y: [100, 0], // Move the elements on y-axis from 100 to 0.
    }
});
anim.play();
```

[→ See more about the topic](https://github.com/mystroken/g/blob/master/ANIMATION.md)

###### Use an animations timeline.

```javascript
const tl = new Timeline();
tl
    .add(animate({ el: 'span', p: { y: [0, 100] }}))
    .add(animate({ el: 'span', p: { y: [100, 0] }}), 100)
    .add(animate({ el: 'span', p: { y: [0, 50] }}), -50);

// At anytime, run the animations timeline.
tl.play();
```

[→ More about timeline](https://github.com/mystroken/g/blob/master/TIMELINE.md)

## Credits

For this project, I read a lot of articles and source codes. Here are some of them:

[Gain Motion Superpowers with requestAnimationFrame](https://medium.com/@bdc/gain-motion-superpowers-with-requestanimationframe-ecc6d5b0d9a4)

[Lodash](https://github.com/lodash/lodash) repository.

[@ariiiman/r](https://github.com/ariiiman/r) repository.
