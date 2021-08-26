import { Component } from "../../../component";
import { ComponentDependencies } from "../../../compose";
import { BreadcrumbsComponent } from "../../common/components/breadcrumbs";
import { EVT_CONSTRUCT } from "../../../events";

export class PageManagerComponent extends ComponentDependencies(BreadcrumbsComponent) {

	[EVT_CONSTRUCT]() {
		this.page = null;
	}

	add_page(label) {
		const page = $('<div class="content page-container"></div>')
			.attr('id', "page-" + label)
			.attr("data-page-route", label)
			.hide()
			.appendTo(frappe.container.container).get(0);
		page.label = label;
		frappe.pages[label] = page;

		return page;
	}

	change_to(label) {
		if (this.page && this.page.label === label) {
			$(this.page).trigger('show');
			return;
		}

		let page = null;
		if (label.tagName) {
			// if sent the div, get the table
			page = label;
		} else {
			page = frappe.pages[label];
		}

		if (!page) {
			this.broadcast("page_not_found", label);
			console.log(__('Page not found') + ': ' + label);
			return;
		}

		// hide dialog
		if (window.cur_dialog && cur_dialog.display && !cur_dialog.keep_open) {
			if (!cur_dialog.minimizable) {
				cur_dialog.hide();
			} else if (!cur_dialog.is_minimized) {
				cur_dialog.toggle_minimize();
			}
		}

		// hide current
		if (this.page && this.page != page) {
			this.broadcast("hide_page", this.page);
			$(this.page).hide();
			$(this.page).trigger('hide');
		}

		const old_page = this.page;
		// show new
		if (!this.page || this.page != page) {
			this.page = page;
			this.broadcast("show_page", this.page);
			// $(this.page).fadeIn(300);
			$(this.page).show();
		}

		$(document).trigger("page-change");
		this.broadcast("page_change", old_page, this.page);

		this.page._route = window.location.hash;
		$(this.page).trigger('show');
		!this.page.disable_scroll_to_top && frappe.utils.scroll_to(0);
		frappe.breadcrumbs.update();

		return this.page;
	}
}