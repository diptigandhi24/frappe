import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Displays a boot message to the user stored in frappe.boot.message
 */
export class BootMessagesComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    if (frappe.boot.messages) {
      frappe.msgprint(frappe.boot.messages);
    }
  }
}