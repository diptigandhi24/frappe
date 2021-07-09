import { Component } from "../../../component";

export class SocialComponent extends Component {
  on_startup() {
    frappe.realtime.on('mention', (message) => {
			if (frappe.get_route()[0] !== 'social') {
				frappe.show_alert(message);
			}
		});
  }
}