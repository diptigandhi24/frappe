import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class ChangeLogComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    if (frappe.user_roles.includes('System Manager')) {
      var me = this;
      let change_log = frappe.boot.change_log;
  
      // frappe.boot.change_log = [{
      // 	"change_log": [
      // 		[<version>, <change_log in markdown>],
      // 		[<version>, <change_log in markdown>],
      // 	],
      // 	"description": "ERP made simple",
      // 	"title": "ERPNext",
      // 	"version": "12.2.0"
      // }];
  
      if (!Array.isArray(change_log) || !change_log.length || window.Cypress) {
        return;
      }
  
      // Iterate over changelog
      let change_log_dialog = frappe.msgprint({
        message: frappe.render_template("change_log", {"change_log": change_log}),
        title: __("Updated To New Version 🎉"),
        wide: true,
        scroll: true
      });
      change_log_dialog.keep_open = true;
      change_log_dialog.custom_onhide = () => {
        frappe.call({
          "method": "frappe.utils.change_log.update_last_known_versions"
        });
        this.broadcast("showNotes");
      };

      frappe.call({
        "method": "frappe.utils.change_log.show_update_popup"
      });
    } else {
      this.broadcast("showNotes");
    }
  }
}