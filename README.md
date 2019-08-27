# G

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/mystroken/s/issues)

> G is a garden of small JavaScript utilities.

<br>

NOTE: This project is deeply inspired by the [@ariiiman/r](https://github.com/ariiiman/r) repository. I started it initially for learning purposes, but then I challenged myself to make it even more optimized.


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
