import { Component } from "../../../component";

/**
 * Common sidebar helper methods
 */
export class SideBarInfoComponent extends Component {
	has_sidebar() {
		var flag = 0;
		var route_str = frappe.get_route_str();
		// check in frappe.ui.pages
		flag = frappe.ui.pages[route_str] && !frappe.ui.pages[route_str].single_column;

		// sometimes frappe.ui.pages is updated later,
		// so check the dom directly
		if(!flag) {
			var page_route = route_str.split('/').slice(0, 2).join('/');
			flag = $(`.page-container[data-page-route="${page_route}"] .layout-side-section`).length ? 1 : 0;
		}

		return flag;
	}  
}