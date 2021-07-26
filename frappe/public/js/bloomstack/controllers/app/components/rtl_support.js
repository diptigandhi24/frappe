import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Setup rtl support when detected
 */
export class RTLSupportComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    if (frappe.utils.is_rtl()) {
			var ls = document.createElement('link');
			ls.rel="stylesheet";
			ls.href= "assets/css/frappe-rtl.css";
			document.getElementsByTagName('head')[0].appendChild(ls);
			$('body').addClass('frappe-rtl');
		}
  }
}