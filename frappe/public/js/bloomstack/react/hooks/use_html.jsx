import { useRef, useCallback, useMemo } from "react";
import { useEffect } from "react";
import { is_ref_valid } from "../../web_components/utils";

export const use_html = (element) => {
  if ( element ) {
    // cache conversion to speed up rendering
    const memo = useMemo(() => convertToReact(element), [...Object.entries(element), convertToReact]);
    return memo;
  }

  return null;
}

const simple_types = ["string", "bigint", "number", "undefined"];

export const convertToReact = (element) => {
  if (element) {
    if (typeof element === "object") {
      const { tag, props, children } = Object.assign({
        tag: null,
        props: {},
        children: []
      }, element);

      // separate simple props from complex ones. React will not pass objects or functions
      // cleanly. We'll set those through the node properties instead

      function segregateComplexSimpleProps(p, c){
        const [simple, complex] = p;
        const [key, value] = c;
        if (simple_types.includes(typeof value)) {
          simple_props_count++;
          Reflect.set(simple, key, value);
        } else {
          complex_props_count++;
          Reflect.set(complex, key, value);
        }        
        return p;
      }
      console.log("props that we are receiving", props );
      let simple_props_count = 0;
      let complex_props_count = 0;
      const [simple_props, complex_props] = Object.entries(props).reduce(segregateComplexSimpleProps, [{}, {}]);

      console.log("value simple_props, complex_props",simple_props, complex_props);
      const addCustomSearchTypes = (node) => {
        if (node) {
          // console.log("webcomponenet", node , complex_props );
          const web_component =  node.__web_component || undefined;
          if (complex_props_count > 0) {
            for (const [key, value] of Object.entries(complex_props)) {
              if (key != "ref") {
                if ( web_component ) {                
                  web_component.set_attribute(key, value);
                } else {
                  Reflect.set(node, key, value);
                }
              }
            }
          }

          // we'll just pass the element reference our own way with ref callback.
          if (complex_props.ref) {
            complex_props.ref(node);
          }
        }
      }
      const ref = useCallback(addCustomSearchTypes, [...Object.entries(simple_props), ...Object.entries(complex_props)]);

      const rChildren = (children && children.length > 0) ? children.map(convertToReact) : [];
      return React.createElement(tag, { ...simple_props, ref, children: rChildren });
    } else {
      console.warn("Could not convert to react element: ", element);
    }
  }
  return null;
}