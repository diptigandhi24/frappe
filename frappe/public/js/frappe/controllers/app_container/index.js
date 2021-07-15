import { Compose, withMixins } from "../../compose"
import { SideBarInfoComponent } from "./components/sidebar_info";
import { PageManagerComponent } from "./components/page_manager";
import { BreadcrumbsComponent } from "../common/components/breadcrumbs";

frappe.provide('frappe.pages');
frappe.provide('frappe.views');

export class Container extends Compose(
	withMixins(SideBarInfoComponent, "has_sidebar"),
	withMixins(PageManagerComponent, "add_page", "change_to")
) {
	on_construct() {
		this._intro = "Container contains pages inside `#container` and manages \
		page creation, switching";

    this.container = $('#body_div').get(0);
		this.page = null; // current page
		this.pagewidth = $(this.container).width();
		this.pagemargin = 50;
		window.cur_page = this;
	}

	on_page_change(old_page, new_page) {
		// set data-route in body
		var route_str = frappe.get_route_str();
		$("body").attr("data-route", route_str);
		$("body").attr("data-sidebar", this[SideBarInfoComponent].has_sidebar() ? 1 : 0);
	}
}