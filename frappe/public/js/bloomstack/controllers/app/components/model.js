import { Component } from "../../../component";

/**
 * Initializes data model
 */
export class ModelComponent extends Component {
  on_init() {
    frappe.model.init();
  }
}