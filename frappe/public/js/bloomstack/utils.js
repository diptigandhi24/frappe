export const call_if_exists = (callable, ...args) => {
  if ( callable && typeof callable === "function" ) {
    return callable(...args);
  }
}