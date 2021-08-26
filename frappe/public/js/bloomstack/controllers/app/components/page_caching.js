import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Handles page information caching and clearing
 */
export class PageCachingComponent extends ComponentDependencies(BootInfoComponent) {
	on_boot() {
		// clear cached pages if timestamp is not found
		if (localStorage["page_info"]) {
			frappe.boot.allowed_pages = [];
			var page_info = JSON.parse(localStorage["page_info"]);
			$.each(frappe.boot.page_info, function (name, p) {
				if (!page_info[name] || (page_info[name].modified != p.modified)) {
					delete localStorage["_page:" + name];
				}
				frappe.boot.allowed_pages.push(name);
			});
		} else {
			frappe.boot.allowed_pages = Object.keys(frappe.boot.page_info);
		}
		localStorage["page_info"] = JSON.stringify(frappe.boot.page_info);
	}
}