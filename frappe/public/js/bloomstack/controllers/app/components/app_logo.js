import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { EVT_INIT } from "../../../events";

/**
 * Fetches the app logo url and sets global frappe.app.logo_url
 */
export class AppLogoComponent extends ComponentDependencies(BootInfoComponent) {
  async[EVT_INIT]() {
    const r = await frappe.call('frappe.client.get_hooks', { hook: 'app_logo_url' })
    frappe.app.logo_url = (r.message || []).slice(-1)[0];
    if (window.cordova) {
      let host = frappe.request.url;
      host = host.slice(0, host.length - 1);
      frappe.app.logo_url = host + frappe.app.logo_url;
    }
  }
}