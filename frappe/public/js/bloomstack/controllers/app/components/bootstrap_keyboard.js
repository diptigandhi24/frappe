import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Initializes keyboard bindings
 */
export class BootstrapKeyboardComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    frappe.ui.keys.setup();
  }
}