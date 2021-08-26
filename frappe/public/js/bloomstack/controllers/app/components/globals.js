import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { MetadataCacheComponent } from "./metadata_cache";

/**
 * Sets all frappe API globals
 */
export class GlobalsComponent extends ComponentDependencies(BootInfoComponent, MetadataCacheComponent) {
  on_boot() {
    frappe.session.user = frappe.boot.user.name;
    frappe.session.user_email = frappe.boot.user.email;
    frappe.session.user_fullname = frappe.user_info().fullname;

    frappe.user_defaults = frappe.boot.user.defaults;
    frappe.user_roles = frappe.boot.user.roles;
    frappe.sys_defaults = frappe.boot.sysdefaults;

    frappe.ui.py_date_format = frappe.boot.sysdefaults.date_format.replace('dd', '%d').replace('mm', '%m').replace('yyyy', '%Y');
    frappe.boot.user.last_selected_values = {};

    // Proxy for user globals
    Object.defineProperties(window, {
      'user': {
        get: function () {
          console.warn('Please use `frappe.session.user` instead of `user`. It will be deprecated soon.');
          return frappe.session.user;
        }
      },
      'user_fullname': {
        get: function () {
          console.warn('Please use `frappe.session.user_fullname` instead of `user_fullname`. It will be deprecated soon.');
          return frappe.session.user;
        }
      },
      'user_email': {
        get: function () {
          console.warn('Please use `frappe.session.user_email` instead of `user_email`. It will be deprecated soon.');
          return frappe.session.user_email;
        }
      },
      'user_defaults': {
        get: function () {
          console.warn('Please use `frappe.user_defaults` instead of `user_defaults`. It will be deprecated soon.');
          return frappe.user_defaults;
        }
      },
      'roles': {
        get: function () {
          console.warn('Please use `frappe.user_roles` instead of `roles`. It will be deprecated soon.');
          return frappe.user_roles;
        }
      },
      'sys_defaults': {
        get: function () {
          console.warn('Please use `frappe.sys_defaults` instead of `sys_defaults`. It will be deprecated soon.');
          return frappe.user_roles;
        }
      }
    });
  }
}