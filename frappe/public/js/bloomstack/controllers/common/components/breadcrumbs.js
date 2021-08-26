import { Component } from "../../../component";
import { EVT_CONSTRUCT, EVT_INIT } from "../../../events";

export class BreadcrumbsComponent extends Component {
	[EVT_CONSTRUCT]() {
		this.all = {};

		this.preferred = {
			"File": "",
			"Dashboard": "Customization",
			"Dashboard Chart": "Customization",
			"Dashboard Chart Source": "Customization",
		};

		this.module_map = {
			'Core': 'Settings',
			'Email': 'Settings',
			'Custom': 'Settings',
			'Workflow': 'Settings',
			'Printing': 'Settings',
			'Automation': 'Settings',
			'Setup': 'Settings',
		};

		if (!frappe.breadcrumbs) {
			// Map existing api
			frappe.breadcrumbs = this;
		}
	}

	[EVT_INIT]() {
		$(document).bind('rename', function (event, dt, old_name, new_name) {
			this.rename(dt, old_name, new_name);
		});
	}

	/**
	 * Sets the doctype preference for a certain module
	 * @param {*} doctype The docytpe name
	 * @param {*} module The module name
	 */
	set_doctype_module(doctype, module) {
		localStorage["preferred_breadcrumbs:" + doctype] = module;
	}

	/**
	 * Returns the prefered module of the provided doctype
	 * @param {*} doctype The doctype name
	 */
	get_doctype_module(doctype) {
		return localStorage["preferred_breadcrumbs:" + doctype];
	}

	/**
	 * Adds a module, doctype and type to the breadcrumb and rerenders
	 * @param {*} module The module name
	 * @param {*} doctype The doctype name
	 * @param {*} type The breadcrumb type. Allowed values: undefined, "Custom"
	 */
	add(module, doctype, type) {
		let obj;
		if (typeof module === 'object') {
			obj = module;
		} else {
			obj = {
				module: module,
				doctype: doctype,
				type: type
			}
		}

		this.all[this.current_page()] = obj;
		this.update();
	}

	/**
	 * Returns the current page route
	 * @returns {string} The page route
	 */
	current_page() {
		return frappe.get_route_str();
	}

	/**
	 * Updates the breadcrumb rendering
	 */
	update() {
		var breadcrumbs = this.all[this.current_page()];

		if (!frappe.visible_modules) {
			frappe.visible_modules = $.map(frappe.boot.allowed_modules, (m) => {
				return m.module_name;
			});
		}

		var $breadcrumbs = $("#navbar-breadcrumbs").empty();

		if (!breadcrumbs) {
			$("body").addClass("no-breadcrumbs");
			return;
		}

		if (breadcrumbs.type === 'Custom') {
			const html = `<li><a href="${breadcrumbs.route}">${breadcrumbs.label}</a></li>`;
			$breadcrumbs.append(html);
			$("body").removeClass("no-breadcrumbs");
			return;
		}

		// get preferred module for breadcrumbs, based on sent via module
		var from_module = this.get_doctype_module(breadcrumbs.doctype);

		if (from_module) {
			breadcrumbs.module = from_module;
		} else if (this.preferred[breadcrumbs.doctype] !== undefined) {
			// get preferred module for breadcrumbs
			breadcrumbs.module = this.preferred[breadcrumbs.doctype];
		}

		if (breadcrumbs.module) {
			if (this.module_map[breadcrumbs.module]) {
				breadcrumbs.module = this.module_map[breadcrumbs.module];
			}

			if (frappe.get_module(breadcrumbs.module)) {
				// if module access exists
				var module_info = frappe.get_module(breadcrumbs.module),
					icon = module_info && module_info.icon,
					label = module_info ? module_info.label : breadcrumbs.module;


				if (module_info && !module_info.blocked && frappe.visible_modules.includes(module_info.module_name)) {
					$(repl('<li><a href="#modules/%(module)s">%(label)s</a></li>',
						{ module: breadcrumbs.module, label: __(label) }))
						.appendTo($breadcrumbs);
				}
			}
		}
		if (breadcrumbs.doctype && frappe.get_route()[0] === "Form") {
			if (breadcrumbs.doctype === "User"
				|| frappe.get_doc('DocType', breadcrumbs.doctype).issingle) {
				// no user listview for non-system managers and single doctypes
			} else {
				var route;
				if (frappe.boot.treeviews.indexOf(breadcrumbs.doctype) !== -1) {
					var view = frappe.model.user_settings[breadcrumbs.doctype].last_view || 'Tree';
					route = view + '/' + breadcrumbs.doctype;
				} else {
					route = 'List/' + breadcrumbs.doctype;
				}
				$(repl('<li><a href="#%(route)s">%(label)s</a></li>',
					{ route: route, label: __(breadcrumbs.doctype) }))
					.appendTo($breadcrumbs);
			}
		}

		$("body").removeClass("no-breadcrumbs");
	}

	/**
	 * Updates breadcrumb when a doctype changes name
	 * @param {*} doctype The doctype performing name change
	 * @param {*} old_name The old name
	 * @param {*} new_name The new name
	 */
	rename(doctype, old_name, new_name) {
		var old_route_str = ["Form", doctype, old_name].join("/");
		var new_route_str = ["Form", doctype, new_name].join("/");
		this.all[new_route_str] = this.all[old_route_str];
		delete this.all[old_route_str];
	}
}