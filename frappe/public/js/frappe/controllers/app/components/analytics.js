import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class AnalyticsComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    if(window.mixpanel) {
			window.mixpanel.identify(frappe.session.user);
			window.mixpanel.people.set({
				"$first_name": frappe.boot.user.first_name,
				"$last_name": frappe.boot.user.last_name,
				"$created": frappe.boot.user.creation,
				"$email": frappe.session.user
			});
		}
  }
}