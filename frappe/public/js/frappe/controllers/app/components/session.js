import { BootInfoComponent } from "./boot_info";
import { Component } from "../../../component";

export class SessionComponent extends Component {
	async logout() {
		frappe.app.logged_out = true;
		const r = frappe.call({
      method:'logout'});
    if(r.exc) {
      return;
    }
    this.redirect_to_login();
  }

  redirect_to_login() {
		window.location.href = '/';
  }
  
	handle_session_expired() {
		if(!frappe.app.session_expired_dialog) {
			const dialog = new frappe.ui.Dialog({
				title: __('Session Expired'),
				keep_open: true,
				fields: [
					{ fieldtype:'Password', fieldname:'password',
						label: __('Please Enter Your Password to Continue') },
				],
				onhide: () => {
					if (!dialog.logged_in) {
						frappe.app.redirect_to_login();
					}
				}
			});
			dialog.set_primary_action(__('Login'), () => {
				dialog.set_message(__('Authenticating...'));
				frappe.call({
					method: 'login',
					args: {
						usr: frappe.session.user,
						pwd: dialog.get_values().password
					},
					callback: (r) => {
						if (r.message==='Logged In') {
							dialog.logged_in = true;

							// revert backdrop
							$('.modal-backdrop').css({
								'opacity': '',
								'background-color': '#334143'
							});
						}
						dialog.hide();
					},
					statusCode: () => {
						dialog.hide();
					}
				});
			});
			frappe.app.session_expired_dialog = dialog;
		}
		if(!frappe.app.session_expired_dialog.display) {
			frappe.app.session_expired_dialog.show();
			// add backdrop
			$('.modal-backdrop').css({
				'opacity': 1,
				'background-color': '#4B4C9D'
			});
		}
  }
}