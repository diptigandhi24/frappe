import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { EVT_INIT } from "../../../events";

/**
 * Initializes keyboard bindings
 */
export class BootstrapKeyboardComponent extends ComponentDependencies(BootInfoComponent) {
  [EVT_INIT]() {
    frappe.ui.keys.setup();
  }
}