import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { SocketIOComponent } from "./socketio";

/**
 * Enables energy points support realtime updates
 */
export class EnergyPointsComponent extends ComponentDependencies(
  BootInfoComponent, 
  SocketIOComponent
) {
  on_init() {
    frappe.realtime.on('energy_point_alert', (message) => {
			frappe.show_alert(message);
		});
  }
}