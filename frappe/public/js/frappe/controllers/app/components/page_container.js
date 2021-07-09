import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { Container } from "../../app_container";

/**
 * Injects page container into the dom.
 */
export class PageContainerComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    if($("#body_div").length) {
			$(".splash").remove();
			frappe.temp_container = $("<div id='temp-container' style='display: none;'>")
				.appendTo("body");
			frappe.container = new Container();
			frappe.container.init();
		}
  }
}