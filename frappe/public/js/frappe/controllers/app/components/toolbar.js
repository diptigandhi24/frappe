import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class ToolBarComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
		if(frappe.boot && frappe.boot.home_page!=='setup-wizard') {
			frappe.frappe_toolbar = new frappe.ui.toolbar.Toolbar();
		}
  }
}