import { Component } from "../../../component";
import { EVT_INIT } from "../../../events";

/**
 * Initializes socket io support
 */
export class SocketIOComponent extends Component {
  [EVT_INIT]() {
    frappe.socketio.init();
  }
}