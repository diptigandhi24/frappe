import { Component } from "../../../component";

/**
 * Initializes socket io support
 */
export class SocketIOComponent extends Component {
  on_init() {
    frappe.socketio.init();
  }
}