import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class CSRFComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    // listen to csrf_update
    frappe.realtime.on("csrf_generated", function(data) {
      // handles the case when a user logs in again from another tab
      // and it leads to invalid request in the current tab
      if (data.csrf_token && data.sid===frappe.get_cookie("sid")) {
        frappe.csrf_token = data.csrf_token;
      }
    });
  }
}