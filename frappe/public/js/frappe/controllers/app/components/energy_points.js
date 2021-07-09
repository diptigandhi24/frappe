import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Enables energy points support realtime updates
 */
export class EnergyPointsComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    frappe.realtime.on('energy_point_alert', (message) => {
			frappe.show_alert(message);
		});
  }
}