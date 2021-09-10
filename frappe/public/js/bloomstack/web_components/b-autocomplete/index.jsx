import { make_react_component } from "../../controllers/web_components";
import { passthrough, is_ref_valid } from "../utils";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import style from "./style.scss";
import { AutoCompleteItem } from "./auto_complete_item";
import { use_data_source } from "../../react/hooks/use_data_source";
import { use_measure } from "../../react/hooks/use_measure";
import { useRef } from "react";
import { AutoCompleteGroup } from "./auto_complete_group";
import { EVT_VALUE_CHANGE } from "../../controllers/awesome_bar/events";
import { equals } from "../../utils";
import { useMemo } from "react";

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
    const data_size = 10;
    const scroll_rate_scale = 3;
    // data source hook to manage fetching
    const [loading, data, fetch_rows] = use_data_source(data_source, data_size, sort_model, filter_model);
    // tracks on what page we are on our results query
    const [start, set_start] = useState(0);
    const [fetch_start, set_fetch_start] = useState(0);
    const [fetch_size, set_fetch_size] = useState(data_size);
    // track content measurements to match dropdown to input width
    const [content_ref, content_width, content_height] = use_measure();
    // used to display or hide the auto complete dropdown
    const [display, set_display] = useState("None");
    // tracks this component focus
    const [has_focus, set_has_focus] = useState(false);
    // element reference to the infinite scroller component
    const infinite_ref = useRef();
    // stores all results as they are loaded
    const [rows, set_rows] = useState([]);
    const [last_filter_model, set_last_filter_model] = useState({});

    // update dropdown style on changes
    const dropdown_style = useMemo(() => {
      return {
        minWidth: content_width,
        display
      };
    }, [content_width, display])
    
    // process rows to sort by group
    const groups = useMemo(() => {
      if (rows) {
        // Order rows by group separating into individual arrays:
        // ex: [[group1], [group2], ...etc...]
        const _group_cache = new Map();
        return rows.reduce((p, c) => {
          const group_name = c.group || "default";
          if ( !_group_cache.has(group_name) ) {
            const _new_group = [];
            _group_cache.set(group_name, _new_group);
            p.push(_new_group);
          }
          const _group = _group_cache.get(group_name);
          _group.push(c);
          return p;
        }, []);
      }
      return [];
    }, [rows]);

    // handles calls from infinite scroller for more data
    const more_data_handler = useCallback((rate) => {
      if (!loading) {
        const adjusted_rate = Math.max(Math.ceil(rate * scroll_rate_scale), 1);
        set_fetch_start(start);
        set_fetch_size(Math.floor(data_size * adjusted_rate));
      }
    }, [loading, start, data_size, set_fetch_start, set_fetch_size]);

    // track target focus
    const focus_handler = useCallback((e) => {
      set_has_focus(document.activeElement == e.target);
    }, [set_has_focus]);

    // hide dropdown if we have no data or we are not in focus
    useEffect(() => {
      set_display((rows.length > 0 && has_focus) ? "block" : "none");
    }, [rows, has_focus, set_display]);

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

    // sets infinite scroller on_more_data callback
    useEffect(() => {
      if (is_ref_valid(infinite_ref)) {
        infinite_ref.current.on_more_data = more_data_handler;
      }
    }, [is_ref_valid(infinite_ref), more_data_handler]);

    // wait for data to arrive and append to our rows array.
    useEffect(() => {
      set_start(data.end); // next start
      set_rows([...rows, ...data.rows]);
    }, [data.start, data.end, data.total, set_rows, set_start]);

    // auto fetch next rows on fetch start and size change
    useEffect(() => fetch_rows(fetch_start, fetch_size), [fetch_rows, fetch_start, fetch_size]);

    // Resets results when filters change
    useEffect(() => {
      if (last_filter_model && filter_model && !equals(last_filter_model, filter_model)) {
        set_last_filter_model(Object.assign({}, filter_model));
        set_start(0);
        set_rows([]);
        fetch_rows(0, data_size);
      }
    }, [fetch_rows, data_size, filter_model, last_filter_model, set_last_filter_model, set_rows, set_start])

    // initial load of filters for when user brings input to focus
    useEffect(() => {
      set_start(0);
      fetch_rows(0);
    }, []);

    return <div class="autocomplete" ref={content_ref}>
      <div class="content">
        <slot></slot>
        <div class="dropdown" style={dropdown_style}>
          <b-infinite-scroller ref={infinite_ref} scroll_rate_scale="3">
            <ul>
              {groups && groups.map((rows, i) => <AutoCompleteGroup key={i} rows={rows} renderer={item_renderer} />)}
              {loading && <AutoCompleteGroup rows={[{label: "Loading..."}]} />}
            </ul>
          </b-infinite-scroller>
        </div>
      </div>
    </div>
  }
})