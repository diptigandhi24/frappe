import { BootInfoComponent } from "./boot_info";
import { ComponentDependencies } from "../../../compose";

/**
 * Initializes the moment js library and default settings for frappe
 */
export class MomentIntegrationComponent extends ComponentDependencies(BootInfoComponent) {
  on_boot() {
    moment.locale("en");
    moment.user_utc_offset = moment().utcOffset();
    if(frappe.boot.timezone_info) {
      moment.tz.add(frappe.boot.timezone_info);
    }
  }
}