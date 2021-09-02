import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Helper hook to help element dimention changes
 * 
 * @example
 * const Component = () => {
 *   const [ ref, width, height ] = use_measure();
 *   console.log(width, height);
 *   return <div ref="ref"></div>
 * }
 */
export const use_measure = () => {
  const ref = useRef();
  const [ width, set_width ] = useState();
  const [ height, set_height ] = useState();
  const [ observer, set_observer ] = useState();
  const observer_handler = useCallback((entries) => {
    for(let entry of entries) {
      if ( ref.current == entry.target ) {
        set_width(entry.target.offsetWidth);
        set_height(entry.target.offsetHeight);
      }
    }
  }, [ref, set_width, set_height]);

  useEffect(() => {
    if ( ref.current ) {
      const ob = new ResizeObserver(observer_handler);
      ob.observe(ref.current);
      set_observer(ob);

      return () => {
        ob.disconnect();
      }
    }
  }, [ref, set_observer, observer_handler]);

  return [ ref, width, height ];
}