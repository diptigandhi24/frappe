const { Compose, withMixins } = require("../../compose")
const { EVT_CONSTRUCT } = require("../../events")
const { DataSourceComponent } = require("../../components/data_source")
const { EVT_GET_ROWS } = require("../../components/data_source/events")

export class AwesomeBar extends Compose(
  withMixins(DataSourceComponent,
    "get_data_source"
  )
) {

  [EVT_CONSTRUCT]() {
    this.__value = "";
    this.filters = new Map();
    this.sort_model = {
      "text": "ASC"
    }
  }

  get value() {
    return this.filters.get("search");
  }

  set value(v) {
    this.filters.set("search", v);
  }

  get filter_model() {
    return Object.entries(this.filters.entries());
  }

  async [EVT_GET_ROWS](start, end, sort_model, filter_model, data) {
    console.log("Fetching: ", start, end, sort_model, filter_model);
    return data;
  }
}