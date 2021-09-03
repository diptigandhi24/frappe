import { make_react_component } from "../../controllers/web_components";
import { passthrough } from "../utils";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import style from "./style.scss";
import { AutoCompleteItem } from "./auto_complete_item";
import { use_data_source } from "../../react/hooks/use_data_source";
import { use_measure } from "../../react/hooks/use_measure";
import { useRef } from "react";
import { AutoCompleteGroup } from "./auto_complete_group";

make_react_component({
  tag: "b-autocomplete",
  style,
  props: {
    target: passthrough,
    data_source: passthrough,
    sort_model: passthrough,
    filter_model: passthrough,
    item_renderer: passthrough
  },
  component: ({ target, data_source, sort_model, filter_model, item_renderer }) => {
    const [start, set_start] = useState(0);
    const [fetch_size, set_fetch_size] = useState(20);
    const [data, has_more, page, set_page] = use_data_source(data_source, start, fetch_size, sort_model, filter_model);
    const [content_ref, content_width, content_height] = use_measure();
    const [display, set_display] = useState("None");
    const [dropdown_style, set_dropdown_style] = useState({});
    const [has_focus, set_has_focus] = useState(false);
    const [groups, set_groups] = useState([]);
    const infinite_ref = useRef();

    // track target focus
    const focus_handler = useCallback((e) => {
      set_has_focus(document.activeElement == e.target);
    }, [set_has_focus]);

    // update dropdown style on changes
    useEffect(() => {
      set_dropdown_style({
        minWidth: content_width,
        display
      });
    }, [set_dropdown_style, content_width, content_height, display]);

    // hide dropdown if we have no data or we are not in focus
    useEffect(() => {
      set_display((data.rows.length > 0 && has_focus) ? "block" : "none");
    }, [data, has_focus, set_display]);

    // hook into target focus events
    useEffect(() => {
      if (target) {
        target.addEventListener("blur", focus_handler);
        target.addEventListener("focus", focus_handler);

        return () => {
          target.removeEventListener("blur", focus_handler);
          target.removeEventListener("focus", focus_handler);
        }
      }
    }, [target, focus_handler]);

    useEffect(() => {
      if (data) {
        // turn row array into object where keys are groups
        const _group_order = new Set();
        const _grouped_rows = data.rows.reduce((p, c) => {
          const group_name = c.group || "default";
          if (!Reflect.has(p, group_name)) {
            Reflect.set(p, group_name, []);
            _group_order.add(group_name);
          }
          Reflect.get(p, group_name).push(c);
          return p;
        }, {});

        const result = [];
        for (const group_name of Array.from(_group_order.values())) {
          const rows = Reflect.get(_grouped_rows, group_name);
          result.push(rows);
        }
        set_groups(result);
      }
    }, [set_groups, data]);

    useEffect(() => {
      if ( infinite_ref.current) {
        infinite_ref.current.on_more_data = () => {
          console.log("...Fetching more...", start);
          set_start(start + fetch_size);
          return true;
        }
      }
    }, [infinite_ref]);

    return <div class="autocomplete" ref={content_ref}>
      <div class="content">
        <slot></slot>
        <div class="dropdown" style={dropdown_style}>
          <b-infinite-container ref={infinite_ref}>
            <ul>
              {groups && groups.map((rows, i) => <AutoCompleteGroup key={i} rows={rows} renderer={item_renderer} />)}
            </ul>
          </b-infinite-container>
        </div>
      </div>
    </div>
  }
})