import { Component } from "../../compose";
import { EVT_CONSTRUCT } from "../../events";
import { EVT_DESTROY, EVT_GET_ROWS, EVT_DATA_CHANGE } from "./events";
import { with_debounce } from "../../utils";

export class DataSourceComponent extends Component {

  [EVT_CONSTRUCT]() {
    this.get_rows = with_debounce(this.get_rows, this, 500);
  }

  get_data_source() {
    return this;
  }

  async data_changed() {
    await this.broadcast(EVT_DATA_CHANGE, this);
  }

  async get_rows(start, end, sort_model, filter_model) {
    const data = {
      rows: [],
      last_row_index: null,
      errors: new Set()
    }
    await this.broadcast(EVT_GET_ROWS, start, end, sort_model, filter_model, data);
    if ( typeof sort_model === "function") {
      data.rows.sort(sort_model);
    }
    return data
  }

  async destroy() {
    await this.broadcast(EVT_DESTROY);
  }
}