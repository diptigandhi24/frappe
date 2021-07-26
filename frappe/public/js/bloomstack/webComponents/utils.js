export const toStr = (v) => `${v}`;
export const fromJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch(e) {
    console.warn("Could not parse json data");
    return undefined;
  }
}