import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class BootMessagesComponent extends ComponentDependencies(BootInfoComponent) {
  on_startup() {
    if (frappe.boot.messages) {
      frappe.msgprint(frappe.boot.messages);
    }
  }
}