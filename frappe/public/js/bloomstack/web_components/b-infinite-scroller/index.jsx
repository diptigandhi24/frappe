import { make_react_component } from "../../controllers/web_components";
import { useCallback } from "react";
import { passthrough, to_number, is_ref_valid } from "../utils";
import { use_measure } from "../../react/hooks/use_measure";
import { useState } from "react";
import { useEffect } from "react";
import style from "./style.scss";

make_react_component({
  tag: "b-infinite-scroller",
  style,
  props: {
    on_more_data: passthrough,
    scroll_rate_scale: to_number
  },
  component: ({ on_more_data, scroll_rate_scale }) => {
    const [ref, width, height] = use_measure();
    const [last_scroll_top, set_last_scroll_top] = useState(0);
    const [continuous_last_scroll_top, set_continuous_last_scroll_top] = useState(0);
    const [last_scroll_rate, set_last_scroll_rate] = useState(1);
    if ( scroll_rate_scale < 1) {
      scroll_rate_scale = 1;
    }

    const scroll_measure = useCallback(() => {

      if ( is_ref_valid(ref) && on_more_data ) {
        // track continuous scrolling rate
        const container = ref.current;
        const scroll_height = container.scrollHeight;
        const client_height = container.clientHeight;
        const scroll_top = container.scrollTop;
        const scroll_rate = Math.abs(scroll_top - continuous_last_scroll_top) / client_height;
        set_last_scroll_rate(scroll_rate);
        set_continuous_last_scroll_top(scroll_top);

        if (height > 0) {
          const container_scroll_top = scroll_height - client_height - 5;
          const scroll_pos = Math.ceil(Math.abs(scroll_top));

          if (scroll_pos > container_scroll_top - Math.floor(client_height * Math.max(last_scroll_rate * scroll_rate_scale, 1))) {
            set_last_scroll_top(scroll_top);
            on_more_data(scroll_rate);
          }
        }
      }
    }, [scroll_rate_scale, on_more_data, is_ref_valid(ref), height, last_scroll_rate, continuous_last_scroll_top, set_last_scroll_rate, set_last_scroll_top]);

    return <div ref={ref} className="outter" onScroll={scroll_measure}>
      <slot></slot>
    </div>
  }
});
