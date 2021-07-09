import { ComponentDependencies } from "../../../compose";
import { ToolBarComponent } from "./toolbar";

export class FullWidthComponent extends ComponentDependencies(ToolBarComponent) {
  on_init() {
    frappe.ui.toolbar.set_fullwidth_if_enabled();
  }
}