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

export const equals = (a, b) => {
  if ( a === b ) {
    return true;
  }

  if ( typeof a !== typeof b ) {
    return false;
  }

  if ( Array.isArray(a) && Array.isArray(b) ) {
    return a.length === b.length && a.every((e,i) => e === b[i]);
  }

  if ( a && typeof a === "object" && b && typeof b === "object" ) {
    const a_keys = Object.keys(a);
    const b_keys = Object.keys(b);
    return equals(a_keys, b_keys) && a_keys.every((key) => a[key] === b[key]);
  }

  return a == b;
}

export const get_object_values = (obj) => {
  return [
    ...Object.values(obj),
    ...Object.getOwnPropertySymbols(obj).map(s => Reflect.get(obj, s))
  ];
}