export const call_if_exists = (callable, ...args) => {
  if (callable && typeof callable === "function") {
    return callable(...args);
  }
}

/**
 * A helper function that wraps a function to provide debounced repeated calls.
 * The wrapped function will only be called once if repeatedly called within its timeout window.
 * @param {function} fn The function to debounce
 * @param {*} thisArg The function scope
 * @param {number} timeout Any positive number in milliseconds to wait before calling function
 */
export const with_debounce = (fn, thisArg, timeout) => {
  const fn_map = new WeakMap();
  fn_map.set(fn, {
    resolved: false,
    promise: null,
    resolve: null,
    reject: null,
    fn,
    timeout,
    thisArg,
    last_args: [],
    timeoutId: null
  });

  return (function(...args) {
    const info = fn_map.get(fn);

    if ( info.timeoutId ) {
      info.last_args = null;
      clearTimeout(info.timeoutId);
      info.timeoutId = null;
    }

    // keep promise around between debounce calls to avoid breaking
    // client code that has already called function before.
    if ( !info.promise || info.resolved ) {
      info.promise = new Promise((resolve, reject) => {
        info.resolve = resolve;
        info.reject = reject;
      });
      info.resolved = false;
    }

    const timeoutCallback = function(fn, thisArg, args, promise, resolve, reject) {
      Promise.resolve(fn.apply(thisArg, args))
        .then((result) => {
          return resolve(result);
        })
        .catch(reject);
    }

    info.last_args = args;
    info.timeoutId = setTimeout(() => {
      timeoutCallback(info.fn, info.thisArg, info.last_args, info.promise, info.resolve, info.reject);
      info.promise = null;
      info.resolved = true;
      info.reject = null;
      info.resolve = null;
    }, info.timeout);

    return info.promise;

  }.bind(thisArg))
}