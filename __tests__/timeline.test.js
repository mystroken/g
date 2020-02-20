import Timeline from '../Timeline';
import animate from '../animate';

/**
 * @type {Timeline}
 */
let timeline;
const parameters = { delay: 0 };

beforeAll(() => {
  timeline = new Timeline(parameters);
});

describe('#play()', () => {
  test('it can override parameters', () => {
    const params = { delay: 5 };
    timeline.play(params);
    expect(timeline._p.delay).toBe(params.delay);
  });
});

test('it can call complete callback', (done) => {
  const counter = { value: 0 };
  const timeline = new Timeline({ cb: () => done() });
  timeline.add(animate({ el: counter, d: 10, p: { value: [0, 1] } }));
  timeline.play();
});

// test('it can delay the timeline', (done) => {
//   const counter = { value: 0 };
//   const time = Date.now();
//   const duration = 5;
//   const delay = 5;

//   timeline = new Timeline({ cb: () => {
//     const elapsed = Date.now() - time;
//     expect(elapsed).toBe((delay + duration));
//     done();
//   } });
//   timeline.add(animate({ el: counter, d: 1, p: { value: [0, 1] } }));
//   timeline.play();
// });
