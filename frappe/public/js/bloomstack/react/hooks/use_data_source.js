import { useCallback, useState, useEffect } from "react";

export const use_data_source = (data_source, user_block_size) => {
  const [block_size, set_block_size] = useState(user_block_size || 20);
  const [source, set_source] = useState(data_source);
  const [rows, set_rows] = useState();
  const [page, set_page] = useState(0);
  const [data_blocks, set_data_blocks] = useState([]);

  // fetch data from data source
  const fetch_rows = useCallback(async () => {
    const start = page * block_size;
    const end = start + block_size;
    const data = await source.get_rows(start, end, sort_model, filter_model);
    data_blocks.insert_at(page, data.rows);
  }, [source, page, block_size, sort_model, filter_model]);

  // handle updating internal state on filter changes
  const on_filter_change = useCallback(async () => {
    set_page(0);
  }, [set_page]);

  // Hook into data source events
  useEffect(() => {
    set_source(data_source);
    data_source.on("filter_change", on_filter_change);

    return () => {
      data_source.off("filter_change", on_filter_change);
    }
  }, [data_source, source, set_source]);

  // when page, block_size, sort_model or filter_model changes, trigger
  // fetching rows.
  useEffect(async () => {
    await fetch_rows();
  }, [fetch_rows, page, block_size, sort_model, filter_model]);

  return [rows];
}