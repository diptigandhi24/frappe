import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { BootGuestsComponent } from "./boot_guests";
import { EVT_INIT } from "../../../events";

export class UserPermissionsComponent extends ComponentDependencies(
  BootInfoComponent,
  BootGuestsComponent
) {

  [EVT_INIT]() {
    frappe.defaults.update_user_permissions();

    frappe.realtime.on('update_user_permissions', frappe.utils.debounce(() => {
      frappe.defaults.update_user_permissions();
    }, 500));
  }
}