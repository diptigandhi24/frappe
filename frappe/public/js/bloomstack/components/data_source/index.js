import { Component } from "../../compose";
import { EVT_CONSTRUCT } from "../../events";
import { EVT_DESTROY, EVT_GET_ROWS } from "./events";

export class DataSourceComponent extends Component {
  get_data_source() {
    return this;
  }

  async get_rows(start, end, sortModel, filterModel) {
    const data = {
      rows: [],
      last_row_index: null,
      errors: new Set()
    }
    await this.broadcast(EVT_GET_ROWS, start, end, sortModel, filterModel, data);
    return data
  }

  async destroy() {
    await this.broadcast(EVT_DESTROY);
  }
}