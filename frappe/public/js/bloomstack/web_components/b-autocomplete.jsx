import { make_react_component } from "../controllers/web_components";
import { passthrough } from "./utils";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";

make_react_component({
  tag: "b-autocomplete",
  props: {
    target: passthrough,
    data_source: passthrough,
    sort_model: passthrough,
    filter_model: passthrough
  },
  component: ({data_source, sort_model, filter_model}) => {
    const [ source, set_source ] = useState();
    const [ rows, set_rows ] = useState();
    const [ start, set_start ] = useState(0);
    const [ end, set_end ] = useState(20);
    const [ data_blocks, set_data_blocks ] = useState([]);

    const on_filter_change = useCallback(async () => {
      const data = await source.get_rows(start, end, sort_model, filter_model);
      set_rows(data.rows);
      set_start(data.last_row_index + 1);
      set_end(data.last_row_index + 21);
    }, source, start, end, sort_model, filter_model);

    useEffect(() => {
      set_source(data_source);
      data_source.on("filter_change", on_filter_change);

      return () => {
        data_source.off("filter_change", on_filter_change);
      }
    }, [data_source, source, set_source]);

    return <div></div>
  }
})