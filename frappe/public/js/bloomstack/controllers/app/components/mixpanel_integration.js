import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { EVT_INIT } from "../../../events";

/**
 * Enables https://mixpanel.com analytics integration for backend user tracking.
 * To enable, update site_config.json and add:
 * {
 * 	...
 * 	"mixpanel_id": "<mixpanel panel key>"
 * 	...
 * }
 */
export class MixpanelIntegrationComponent extends ComponentDependencies(BootInfoComponent) {
	[EVT_INIT]() {
		if (window.mixpanel) {
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