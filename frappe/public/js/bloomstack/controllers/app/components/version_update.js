import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class VersionUpdateComponent extends ComponentDependencies(BootInfoComponent) {
	on_startup() {
		frappe.realtime.on("version-update", function () {
			let dialog = frappe.msgprint({
				message: __("The application has been updated to a new version, please refresh this page"),
				indicator: 'green',
				title: __('Version Updated')
			});
			dialog.set_primary_action(__("Refresh"), function () {
				location.reload(true);
			});
			dialog.get_close_btn().toggle(false);
		});
	}
}