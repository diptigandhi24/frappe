import { ComponentDependencies } from "../../../compose";
import { ToolBarComponent } from "./toolbar";
import { EVT_INIT } from "../../../events";

/**
 * Sets desk's fullwidth mode on startup if enabled.
 */
export class FullWidthComponent extends ComponentDependencies(ToolBarComponent) {
  [EVT_INIT]() {
    frappe.ui.toolbar.set_fullwidth_if_enabled();
  }
}