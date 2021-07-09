import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class BootGuestsComponent extends ComponentDependencies(BootInfoComponent) {
  on_bootGuests() {
    frappe.session.user = 'Guest';
		frappe.session.user_email = '';
		frappe.session.user_fullname = 'Guest';

		frappe.user_defaults = {};
		frappe.user_roles = ['Guest'];
		frappe.sys_defaults = {};
  }
}