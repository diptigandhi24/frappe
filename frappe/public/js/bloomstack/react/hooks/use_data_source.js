import { useCallback, useState, useEffect } from "react";
import { EVT_DATA_CHANGE } from "../../components/data_source/events";

export const use_data_source = (data_source, start_page, user_block_size, sort_model, filter_model) => {
  const [block_size, set_block_size] = useState(user_block_size || 20);
  const [page, set_page] = useState(start_page || 0);
  const [data, set_data] = useState({ rows: [] });
  const [has_more, set_has_more] = useState(true);

  // fetch data from data source
  const fetch_rows = useCallback(async () => {
    if (data_source) {
      const start = page * block_size;
      const end = start + block_size;
      const data = await data_source.get_rows(start, end, sort_model, filter_model);
      set_data(data);
      set_has_more(!!data.last_row_index);
    }
  }, [data_source, page, block_size, sort_model, filter_model]);

  // if data source's data changes force rerender
  const on_data_change = useCallback(async () => {
    set_page(0);
    fetch_rows();
  }, [set_page, fetch_rows, sort_model, filter_model])

  // Hook into data source events
  useEffect(() => {
    if (data_source) {
      data_source.on(EVT_DATA_CHANGE, on_data_change);
      return () => {
        data_source.off(EVT_DATA_CHANGE, on_data_change);
      }
    }
  }, [data_source]);

  // reset rows if filter or sorting changes.
  useEffect(async () => {
    set_page(0);
    fetch_rows();
  }, [fetch_rows, sort_model, filter_model, user_block_size]);

  // when page, block_size, sort_model or filter_model changes, trigger
  // fetching rows.
  useEffect(async () => {
    await fetch_rows();
  }, [fetch_rows, filter_model]);

  return [data, has_more, page, set_page];
}