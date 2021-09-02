import { Compose, withMixins } from "../../compose";
import { EVT_CONSTRUCT, EVT_INIT } from "../../events";
import { DataSourceComponent } from "../../components/data_source";
import { EVT_GET_ROWS } from "../../components/data_source/events";
import { FilterToolsComponent } from "./components/filter_tools";
import { EVT_FILTER_CHANGE, EVT_VALUE_CHANGE, EVT_FILTER_MODEL_CHANGE } from "./events";
import { Search } from "../search";

export class AwesomeBar extends Compose(
  withMixins(DataSourceComponent,
    "get_data_source"
  ),
  FilterToolsComponent
) {

  [EVT_CONSTRUCT]() {
    this.__value = "";
    this.filters = new Map();
    this.sort_model = (a, b) => {
      return a.index - b.index;
    };
    this.search = new Search();
  }

  async [EVT_INIT]() {
    await this.search.init();
  }

  get value() {
    return this.filters.get("search");
  }

  set value(v) {
    this.filters.set("search", (v || ""));
    this.broadcast(EVT_FILTER_CHANGE, "search")
      .then(async () => await this.broadcast(EVT_VALUE_CHANGE, this.filters.get("search") || ""))
      .then(async () => await this.broadcast(EVT_FILTER_MODEL_CHANGE));
  }

  get filter_model() {
    return Object.fromEntries(this.filters.entries());
  }

  async [EVT_GET_ROWS](start, end, sort_model, filter_model, data) {
    const search = (filter_model["search"] || "");
    let results = [];
    if ( search ) {
      results.push(...this.search.get_modules(search));
      results.push(...this.search.get_doctypes(search));
      results.push(...this.search.get_reports(search));
    }
  
    if ( filter_model["filter_by"] ) {
      results = results.filter(r => r.type == filter_model["filter_by"]);
    }

    data.total = results.length;
    data.rows.push(...results.slice(start, end));
  }

}