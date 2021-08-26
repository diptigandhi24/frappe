import { ComponentDependencies } from "../../../compose";
import { EVT_AFTER_INIT } from "../../../events";
import { BootInfoComponent } from "./boot_info";

/**
 * Initializes toolbar controller
 */
export class ToolBarComponent extends ComponentDependencies(BootInfoComponent) {
	[EVT_AFTER_INIT]() {
		if (frappe.boot && frappe.boot.home_page !== 'setup-wizard') {
			//frappe.frappe_toolbar = new frappe.ui.toolbar.Toolbar();
		}
	}
}