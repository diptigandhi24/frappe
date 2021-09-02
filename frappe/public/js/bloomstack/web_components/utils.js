bloomstack.breakpoints = [
  {name: "xs", size: 0},
  {name: "sm", size: 576},
  {name: "md", size: 768},
  {name: "lg", size: 992},
  {name: "xl", size: 1200},
  {name: "xxl", size: 1400}
];

export const to_str = (v) => (typeof v !== "undefined" && v !== null)?`${v}`:undefined;
export const parse_json = (data) => {
  try {
    return JSON.parse(data);
  } catch(e) {
    console.warn("Could not parse json data");
    return undefined;
  }
}
export const to_number = (v) => parseFloat(v);
export const to_bool = (v) => {
  const v_str = `${v}`.toLowerCase().trim();
  if ( v_str == "true" || v_str == "1" ) {
    return true;
  } else if ( v_str == "false" || v_str == "0" ) {
    return false;
  }
  return !!v_str;
}
export const enums = function(...values) {
  return (v) => {
    if ( values.includes(v) ) {
      return v;
    }
    return undefined;
  }
}
export const passthrough = (x) => x;
export const prop_to_dom_event_map = (event, event_dict) => (wc, old, value) => wc.element.dispatchEvent(new Event(event, event_dict))
export const to_array = (x) => {
  if ( x ) {
    if ( Array.isArray(x) ) {
      return x;
    } else if ( typeof x === "string" ) {
      try {
        x = JSON.parse(x);
        return to_array(x);
      } catch(ex) {
        // pass
      }
    }
  }

  return [];
}

export const list_breakpoints = () => {
  return bloomstack.breakpoints;
}

export const find_breakpoint_by_size = (size) => {
  return bloomstack.breakpoints
    .filter((b) => size >= b.size)
    .pop();
}

export const find_cascading_breakpoints = (size) => {
  return bloomstack.breakpoints
    .filter((b) => size >= b.size);
}

export const find_breakpoint_size = (name) => {
  return bloomstack.breakpoints.find((b) => b.name == name).size;
}

export const find_element_breakpoint = (element) => {
  const width = element.clientWidth;
  if ( width === 0 ) {
    return undefined;
  }
  return find_breakpoint_by_size(width);
}