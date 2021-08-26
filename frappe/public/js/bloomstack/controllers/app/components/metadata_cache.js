import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Handles initializing and clearing metadata cache in local storage
 */
export class MetadataCacheComponent extends ComponentDependencies(BootInfoComponent) {
  on_boot() {
    if (frappe.boot.metadata_version != localStorage.metadata_version) {
      frappe.assets.clear_local_storage();
      frappe.assets.init_local_storage();
    }
  }
}