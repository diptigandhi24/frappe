import { make_react_component } from "../../controllers/web_components";
import { useCallback } from "react";
import { passthrough } from "../utils";
import { use_measure } from "../../react/hooks/use_measure";
import { useState } from "react";
import { useEffect } from "react";
import style from "./style.scss";

make_react_component({
  tag: "b-infinite-container",
  style,
  props: {
    on_more_data: passthrough
  },
  component: ({ on_more_data }) => {
    const [component_ref, component_width,component_height ] = use_measure();
    const [container_ref, container_width, container_height] = use_measure();
    const [loading, set_loading] = useState(false);
    const [freeze, set_freeze] = useState(false);

    const scroll_measure = useCallback(async () => {
      if ( freeze || loading ) {
        return;
      }

      if ( container_height > 0 && component_height > 0 ) {
        const container_scroll_height = container_ref.current.scrollHeight;
        const container_top = container_ref.current.scrollTop;
        const container_load_top = container_scroll_height - container_height - (container_height / 2);

        console.log("---------------------------------------");
        console.log("container_height: ", component_height);
        console.log("container_scroll_height: ", container_scroll_height);
        console.log("container_load_top", container_load_top);
        console.log("container_top: ", container_top);
        if ( container_scroll_height > container_height && container_top >= container_load_top ) {
          try {
            set_loading(true);
            console.log("Fetch more...");
            const has_more = await on_more_data();
            if ( !has_more ) {
              set_freeze(true);
            }
          } finally {
            set_loading(false);
          }
        }
      }
    }, [on_more_data, set_loading, set_freeze, container_ref, component_ref, container_height]);

    const scroll_handler = useCallback(async (e) => {
      scroll_measure();
    }, [on_more_data, scroll_measure]);

    // initial 
    useEffect(async () => {
      scroll_measure();
    }, [on_more_data, scroll_measure]);

    return <div ref={component_ref} class="outter">
      <div ref={container_ref} class="container" onScroll={scroll_handler}>
        <slot></slot>
      </div>
      {loading && <div>Loading...</div>}
    </div>
  }
});
