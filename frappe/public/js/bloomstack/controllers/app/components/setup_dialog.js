import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class SetupDialogComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    if (frappe.ui.startup_setup_dialog && !frappe.boot.setup_complete) {
      frappe.ui.startup_setup_dialog.pre_show();
      frappe.ui.startup_setup_dialog.show();
    }
  }
}