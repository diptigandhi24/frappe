import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";
import { Container } from "../../app_container";
import { EVT_INIT } from "../../../events";

/**
 * Injects page container into the dom.
 */
export class PageContainerComponent extends ComponentDependencies(BootInfoComponent) {
	async [EVT_INIT]() {
		if ($("#body_div").length) {
			$(".splash").remove();
			frappe.temp_container = $("<div id='temp-container' style='display: none;'>")
				.appendTo("body");
			frappe.container = new Container();
			await frappe.container.init();
		}
	}
}