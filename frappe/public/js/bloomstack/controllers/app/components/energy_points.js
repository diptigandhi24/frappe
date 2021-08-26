import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { SocketIOComponent } from "./socketio";
import { EVT_INIT } from "../../../events";

/**
 * Enables energy points support realtime updates
 */
export class EnergyPointsComponent extends ComponentDependencies(
  BootInfoComponent, 
  SocketIOComponent
) {
  [EVT_INIT]() {
    frappe.realtime.on('energy_point_alert', (message) => {
			frappe.show_alert(message);
		});
  }
}