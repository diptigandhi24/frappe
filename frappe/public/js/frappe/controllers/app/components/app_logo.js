import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Fetches the app logo url and sets global frappe.app.logo_url
 */
export class AppLogoComponent extends ComponentDependencies(BootInfoComponent) {
  async on_init() {
    const r = await frappe.call('frappe.client.get_hooks', { hook: 'app_logo_url' })
    frappe.app.logo_url = (r.message || []).slice(-1)[0];
    if (window.cordova) {
      let host = frappe.request.url;
      host = host.slice(0, host.length - 1);
      frappe.app.logo_url = host + frappe.app.logo_url;
    }
  }
}