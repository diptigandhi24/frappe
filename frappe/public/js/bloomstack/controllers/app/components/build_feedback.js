import { Component } from "../../../component";

/**
 * Enables realtime build feedback errors when developer_mode is enabled on
 * site_config.json
 */
export class BuildFeedbackComponent extends Component {
  on_startup() {
    if (frappe.boot.developer_mode) {
			frappe.realtime.on('build_error', (data) => {
				console.error(data);
			});
		}
  }
}