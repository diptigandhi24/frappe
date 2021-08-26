import { Component } from "../../../compose";
import { EVT_INIT } from "../../../events";

export class BootInfoComponent extends Component {
  async [EVT_INIT]() {
    if(frappe.boot.status==='failed') {
      frappe.msgprint({
        message: frappe.boot.error,
        title: __('Session Start Failed'),
        indicator: 'red',
      });
      throw 'boot failed';
    }

    if ( frappe.boot ) {
      frappe.modules = {};
      frappe.boot.allowed_modules.forEach(function(m) {
        frappe.modules[m.module_name]=m;
      });
      frappe.model.sync(frappe.boot.docs);
      $.extend(frappe._messages, frappe.boot.__messages);

      await this.broadcast("boot");
      frappe.user.name = frappe.boot.user.name;
    } else {
      await this.broadcast("boot_guest");
    }
  }
}