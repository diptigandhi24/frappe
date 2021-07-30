import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Initializes toolbar controller
 */
export class ToolBarComponent extends ComponentDependencies(BootInfoComponent) {
  on_after_init() {
		if(frappe.boot && frappe.boot.home_page!=='setup-wizard') {
			//frappe.frappe_toolbar = new frappe.ui.toolbar.Toolbar();
		}
  }
}