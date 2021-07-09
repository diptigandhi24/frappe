import { Compose } from "../../compose"
import { SideBarInfoComponent } from "./components/sidebar_info";

frappe.provide('frappe.pages');
frappe.provide('frappe.views');

export class Container extends Compose(SideBarInfoComponent) {
	on_construct() {
		this._intro = "Container contains pages inside `#container` and manages \
		page creation, switching";
    this.container = $('#body_div').get(0);
		this.page = null; // current page
		this.pagewidth = $(this.container).width();
		this.pagemargin = 50;

		var me = this;

		$(document).on("page-change", function() {
			// set data-route in body
			var route_str = frappe.get_route_str();
			$("body").attr("data-route", route_str);
			$("body").attr("data-sidebar", me.has_sidebar() ? 1 : 0);
		});

		$(document).bind('rename', function(event, dt, old_name, new_name) {
			frappe.breadcrumbs.rename(dt, old_name, new_name);
		});
	}

	add_page(label) {
		const page = $('<div class="content page-container"></div>')
			.attr('id', "page-" + label)
			.attr("data-page-route", label)
			.hide()
			.appendTo(this.container).get(0);
		page.label = label;
		frappe.pages[label] = page;

		return page;
	}

	change_to(label) {
		const me = this;
		window.cur_page = this;
		if(this.page && this.page.label === label) {
			$(this.page).trigger('show');
			return;
		}

		let page = null;
		if(label.tagName) {
			// if sent the div, get the table
			page = label;
		} else {
			page = frappe.pages[label];
		}
		
		if(!page) {
			console.log(__('Page not found')+ ': ' + label);
			return;
		}

		// hide dialog
		if(window.cur_dialog && cur_dialog.display && !cur_dialog.keep_open) {
			if (!cur_dialog.minimizable) {
				cur_dialog.hide();
			} else if (!cur_dialog.is_minimized) {
				cur_dialog.toggle_minimize();
			}
		}

		// hide current
		if(this.page && this.page != page) {
			$(this.page).hide();
			$(this.page).trigger('hide');
		}

		// show new
		if(!this.page || this.page != page) {
			this.page = page;
			// $(this.page).fadeIn(300);
			$(this.page).show();
		}

		$(document).trigger("page-change");

		this.page._route = window.location.hash;
		$(this.page).trigger('show');
		!this.page.disable_scroll_to_top && frappe.utils.scroll_to(0);
		frappe.breadcrumbs.update();

		return this.page;
	}

	has_sidebar() {
    return this[SideBarInfoComponent].has_sidebar();
	}
}