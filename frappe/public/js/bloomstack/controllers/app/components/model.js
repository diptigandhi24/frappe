import { Component } from "../../../component";
import { EVT_INIT } from "../../../events";

/**
 * Initializes data model
 */
export class ModelComponent extends Component {
  [EVT_INIT]() {
    frappe.model.init();
  }
}