import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class PrintCSSComponent extends ComponentDependencies(BootInfoComponent) {
  on_boot() {
    if(frappe.boot.print_css) {
      frappe.dom.set_style(frappe.boot.print_css, "print-style");
    }
  }
}