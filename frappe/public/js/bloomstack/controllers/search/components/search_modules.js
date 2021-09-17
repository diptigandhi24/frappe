import { Component, ComponentDependencies } from "../../../compose";
import { FuzzySearchComponent } from "./fuzzy_search";
import { EVT_BUILD_STORE } from "../events";

export class SearchModulesComponent extends ComponentDependencies(FuzzySearchComponent) {

	[EVT_BUILD_STORE](out) {
		const parent = this.parent;
		for(const item of Object.keys(frappe.modules)) {
			let module = frappe.modules[item];
			if (module._doctype) return;

			// disallow restricted modules
			if (frappe.boot.user.allow_modules &&
				!frappe.boot.user.allow_modules.includes(module.module_name)) {
				return;
			}
			let ret = {
				type: "Module",
				label: __(item),
				index: level,
			};
			if(module.link) {
				ret.route = [module.link];
			} else {
				ret.route = ["Module", item];
			}
			out.push(ret);
		}
	}

	get_modules(keywords) {
		const parent = this.parent;
		const out = [];
		Object.keys(frappe.modules).forEach(function(item) {
			let level = parent.fuzzy_search(keywords, item);
			if(level > 0) {
				let module = frappe.modules[item];
				if (module._doctype) return;

				// disallow restricted modules
				if (frappe.boot.user.allow_modules &&
					!frappe.boot.user.allow_modules.includes(module.module_name)) {
					return;
				}
				let ret = {
					type: "Module",
					label: __(item),
					index: level,
				};
				if(module.link) {
					ret.route = [module.link];
				} else {
					ret.route = ["Module", item];
				}
				out.push(ret);
			}
		});
		return out;
	}
}