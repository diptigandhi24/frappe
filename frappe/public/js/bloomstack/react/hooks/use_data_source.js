import { useCallback, useState, useEffect } from "react";

export const use_data_source = (data_source, default_block_size, sort_model, filter_model) => {
  const [_default_block_size, set_default_block_size] = useState(default_block_size || 20);
  const [loading, set_loading] = useState(false);
  const [data, set_data] = useState({
    start: 0,
    end: 0,
    total: 0,
    rows: []
  });

  // fetch data from data source
  const fetch_rows = useCallback(async (start, block_size) => {
    if ( !start ) {
      start = 0;
    }

    if ( !block_size ) {
      block_size = _default_block_size;
    }

    if (data_source && !loading) {
      const end = start + block_size;
      try {
      set_loading(true);
      const data = await data_source.get_rows(start, end, sort_model, filter_model);
      set_data(data);
      } finally {
        set_loading(false)
      }
    }
  }, [data_source, _default_block_size, sort_model, filter_model, set_loading, set_data]);

  return [loading, data, fetch_rows];
}