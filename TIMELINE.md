# G:  Animation timeline

Timelines are useful to stagger a set animations.

### Getting started

```javascript
import animate from '@mystroken/g/animate';
import Timeline from '@mystroken/g/Timeline';

const params = {};
const timeline = new Timeline(params);
timeline
  .add(animate({ el: 'span', p: { y: [0, 100] }}))
  .add(animate({ el: 'span', p: { y: [100, 0] }}))
  .add(animate({ el: 'span', p: { y: [0, 50] }}), '-=50');

// At anytime, run the animations timeline.
timeline.play();
```

<br>
<br>

# Parameters

A parameters object can be passed to the timeline to have more control on it. Timeline parameters are totally optionnal and you can pass them either at the instantiation time (as on the previous example) or when you call the `play` method of the timeline ([See the play method details](#play)).

### delay

Determines the delay before the timeline starts running animations (in ms).

| Default | Type   |
|:------- |:------ |
| `0`     | Number |

### cb

Defines a callback invoked at the end of the timeline.

| Default | Type     |
|:------- |:-------- |
| `null`  | Function |

### update

Defines a callback invoked on every frame of the timeline.

| Default | Type     | Params                                                   |
|:------- |:-------- | -------------------------------------------------------- |
| `null`  | Function | progress (between 0 and 1), elapsed time, total duration |

<br>
<br>

# Methods

### add

Add an animation to the timeline.

```javascript
timeline.add(animation, offset);
```

| Argument  | Types               | Info                                                    | Required |
|:--------- |:------------------- | ------------------------------------------------------- | -------- |
| animation | `animateInstance`   | The instance of the animation (animate.js)              | Yes      |
| offset    | `String`\| `Number` | offset defines when a animation starts in the timeline. | No       |

If no offset is specifed, the animation will start after the previous animation ends. An offset can be relative to the last animation or absolute to the whole timeline.

- **Relative Offset** :
  
  - `offset: "-=100"`: start this animation 100ms before the previous animation finishes.
  
  - `offset: "+=100"`: start this animation 100ms after the previous animation finishes.

- **Absolute Offset** :
  
  - `offset: 0`: start at the beginning in the timeline.
  
  - `offset: 200`: start at 200ms in the timeline.

### play

Run the timeline.

```javascript
// You can override the 
// timeline parameters by
// passing an object to the method.
timeline.play({ delay: 1000 });
```

| Argument   | Types    | Info                                                                                   | Required |
|:---------- |:-------- | -------------------------------------------------------------------------------------- | -------- |
| parameters | `Object` | The parameters used to control the timeline. [See the parameters section](#parameters) | No       |

### pause

Pause the timeline.

### stop

Stop the timeline
