import { Component } from "../../../component";

export class ActionsComponent extends Component {
  /**
   * Triggers primary action on the current page
   */
  trigger_primary_action() {
		if(window.cur_dialog && cur_dialog.display) {
			// trigger primary
			cur_dialog.get_primary_btn().trigger("click");
		} else if(cur_frm && cur_frm.page.btn_primary.is(':visible')) {
			cur_frm.page.btn_primary.trigger('click');
		} else if(frappe.container.page.save_action) {
			frappe.container.page.save_action();
		}
  }
}