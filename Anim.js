'use strict';
var Clamp = require('./Clamp');

/**
 * Track the elapsed time.
 *
 * @param {*} id
 */
const trackTime = id => {
  const [entry] = performance.getEntriesByName(id);

  if (!entry) {
    // Save the start time of the animation
    performance.mark(id);
    return 0;
  }

  // Calculate the elapsed time.
  return performance.now() - entry.startTime;
};

/**
 * Get the progress.
 *
 * @param {Object} param0 { id, duration }
 */
const getProgress = ({duration, id}) => {
  const progress = Clamp(trackTime(id) / duration, 0, 1);
  // Remove the mark when we've done.
  if (progress === 1) performance.clearMarks(id);
  return progress;
};

/**
 * The animation is done here.
 */
const tick = () => {
  // Get the progress.
  const progress = getProgress(animation);

  // Calculate the current properties to animate.

  // Update the animated elements.

  // Check if we've done or not.
  if (progress < 1) requestAnimationFrame(tick);
};

const animation = {
  duration: 500,
  id: requestAnimationFrame(tick),
};
