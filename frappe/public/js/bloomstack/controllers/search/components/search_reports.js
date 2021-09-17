import { Component } from "../../../compose";
import { EVT_BUILD_STORE } from "../events";

export class SearchReportsComponent extends Component {
	[EVT_BUILD_STORE](out) {
		let parent = this.parent;
		let route;
		for (const item of Object.keys(frappe.boot.user.all_reports)) {
			let report = frappe.boot.user.all_reports[item];
			if (report.report_type == "Report Builder")
				route = ["List", report.ref_doctype, "Report", item];
			else
				route = ["query-report", item];
			out.push({
				type: "Report",
				label: __("{0} Report", [__(item)]),
				index: level,
				route: route
			});
		}
	}

	get_reports(keywords) {
		let parent = this.parent;
		let out = [];
		let route;
		Object.keys(frappe.boot.user.all_reports).forEach(function (item) {
			let level = parent.fuzzy_search(keywords, item);
			if (level > 0) {
				let report = frappe.boot.user.all_reports[item];
				if (report.report_type == "Report Builder")
					route = ["List", report.ref_doctype, "Report", item];
				else
					route = ["query-report", item];
				out.push({
					type: "Report",
					label: __("{0} Report", [__(item)]),
					index: level,
					route: route
				});
			}
		});
		return out;
	}
}