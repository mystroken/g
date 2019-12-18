/**
 * Returns a function that, as long as it is called,
 * it run only once every N milliseconds.
 *
 * @param {Function} func The function to control
 * @param {Number} wait The number of milliseconds to wait before to run the func function.
 * @param {}
 * @param {*?} context The context in which to run func() (default value is `this`)
 *
 *  - leading (optionnel) : Appeler également func() à la première
 *                          invocation (Faux par défaut)
 *  - trailing (optionnel) : Appeler également func() à la dernière
 *                           invocation (Faux par défaut)
 *  - context (optionnel) : le contexte dans lequel appeler func()
 *                          (this par défaut)
 */
function throttle(func, wait, leading, trailing, context) {
  var ctx, args, result;
  var timeout = null;
  var previous = 0;

  var later = function() {
    previous = new Date;
    timeout = null;
    result = func.apply(ctx, args);
  };

  return function() {
    var now = new Date;
    if (!previous && !leading) previous = now;
    var remaining = wait - (now - previous);
    ctx = context || this;
    args = arguments;
    // Si la période d'attente est écoulée
    if (remaining <= 0) {
      // Réinitialiser les compteurs
      clearTimeout(timeout);
      timeout = null;
      // Enregistrer le moment du dernier appel
      previous = now;
      // Appeler la fonction
      result = func.apply(ctx, args);
    } else if (!timeout && trailing) {
      // Sinon on s’endort pendant le temps restant
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

export default throttle;
