import { Component } from "../../../component";

export class BuildFeedbackComponent extends Component {
  on_startup() {
    if (frappe.boot.developer_mode) {
			frappe.realtime.on('build_error', (data) => {
				console.error(data);
			});
		}
  }
}