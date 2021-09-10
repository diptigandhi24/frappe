import { Component, ComponentDependencies } from "../../../compose";
import {
  FILTER_NONE,
  FILTER_MODULE,
  FILTER_DOCTYPE,
  FILTER_REPORT,
} from "../constants";
import {
  EVT_FILTER_CHANGE,
  EVT_MODE_CHANGE,
  EVT_FILTER_MODEL_CHANGE
} from "../events";
import { EVT_CONSTRUCT } from "../../../events";
import { DataSourceComponent } from "../../../components/data_source";
import { EVT_GET_ROWS } from "../../../components/data_source/events";
import { get_object_values } from "../../../utils";

/**
 * Handles inserting filters to the awesomebar controller data queries.
 */
export class FilterToolsComponent extends ComponentDependencies(DataSourceComponent) {
  [EVT_CONSTRUCT]() {
    const filter_select_handler = this.filter_select_handler.bind(this);

    this.filter_mode = FILTER_NONE;

    // Awesomebar filter options to display.
    // The .meta key is used internally to store data about the filter.
    this.filters = {
      [FILTER_MODULE]: {
        label: "Module:",
        group: "filters",
        on_select: filter_select_handler,
        index: -100,
        meta: {
          tag: "module:",
          filter: FILTER_MODULE,
          filter_by: "Module",
          value: "module:",
        }
      },
      [FILTER_DOCTYPE]: {
        label: "Doctype:",
        group: "filters",
        on_select: filter_select_handler,
        index: -99,
        meta: {
          tag: "doctype:",
          filter: FILTER_DOCTYPE,
          filter_by: "Doctype",
          value: "module:",
        }
      },
      [FILTER_REPORT]: {
        label: "Report:",
        group: "filters",
        on_select: filter_select_handler,
        index: -98,
        meta: {
          tag: "report:",
          filter: FILTER_REPORT,
          filter_by: "Report",
          value: "module:",
        }
      }
    };
  }

  /**
   * Handles click events on the filters when displayed on the awesomebar dropdown.
   * @param {object} row 
   */
  filter_select_handler(row) {
    this.parent.value = row.meta.value;
  }

  /**
   * Sets this component's filter mode.
   * @param {Symbol} mode 
   */
  async set_mode(mode) {
    if (this.filter_mode === mode) {
      return;
    }

    this.filter_mode = mode;
    let mode_tag = "";
    if (mode !== FILTER_NONE) {
      this.parent.filters.set("filter_by", this.filters[mode].meta.filter_by);
      const value = this.parent.filters.get("search") || "";
      const value_normalized = value.toLowerCase();
      mode_tag = this.filters[mode].meta.tag;
      if (value_normalized.indexOf(mode_tag) == 0) {
        this.parent.filters.set("search", value.substring(mode_tag.length) || "");
      }
    } else {
      this.parent.filters.delete("filter_by");
    }

    await this.broadcast(EVT_MODE_CHANGE, this.filter_mode, mode_tag);
    await this.broadcast(EVT_FILTER_MODEL_CHANGE);
  }

  /**
   * Handles filter changes events to update internal mode.
   * @param {string} filter 
   */
  async [EVT_FILTER_CHANGE](filter) {
    const value = (this.parent.filters.get(filter) || "").trim().toLowerCase();
    // Look for the search filter value changes and apply a mode if we can match a tag.
    if (value && filter == "search") {
      const filter_to_apply = get_object_values(this.filters).find(f => value.startsWith(f.meta.tag));
      if (filter_to_apply) {
        this.set_mode(filter_to_apply.meta.filter);
      }
    }
  }

  /**
   * Data source get_rows event handler. We'll insert filters into results here.
   * @param {*} start Start index of the query
   * @param {*} end End index of the query
   * @param {*} sort_model A sort model to apply
   * @param {*} filter_model A filter model to apply
   * @param {*} data A data object to update with results and data.
   */
  async [EVT_GET_ROWS](start, end, sort_model, filter_model, data) {
    const search = (this.parent.filters.get("search") || "").trim().toLowerCase();
    if ( start == 0 ) {
      if (search) {
        if (this.filter_mode === FILTER_NONE) {
          // remove filters that don't match the search keywords
          const result = Object.values(this.filters)
            .filter((f) => f.meta.tag.toLowerCase().indexOf(search) > -1);
          data.rows.push(...result);
          data.total += result.length;
        }
      } else {
        if (this.filter_mode === FILTER_NONE) {
          const result = get_object_values(this.filters);
          data.rows.push(...result);
          data.total += result.length;
        }
      }
    }
  }
}