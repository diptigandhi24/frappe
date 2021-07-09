import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class DeveloperUtilsComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    if (!frappe.boot.developer_mode) {
      setInterval(function() {
        frappe.call({
          method: 'frappe.core.page.background_jobs.background_jobs.get_scheduler_status',
          callback: function(r) {
            if (r.message[0] == __("Inactive")) {
              frappe.call('frappe.utils.scheduler.activate_scheduler');
            }
          }
        });
      }, 300000); // check every 5 minutes
    }
  }
}