import { Component } from "../../../component";

/**
 * Fetches user emails waiting in queue.
 * This component will prompt user for any email passwords if required.
 */
export class EmailComponent extends Component {
  on_startup() {
    // Prompt user email password for any user password awaiting
    if (frappe.sys_defaults.email_user_password) {
			var email_list =  frappe.sys_defaults.email_user_password.split(',');
			for (var u in email_list) {
				if (email_list[u] === frappe.user.name) {
          this.set_password(email_list[u]);
				}
			}
		}
  }

  async set_password(user) {
    const me = this;
		let email_account = await frappe.call({
			method: 'frappe.core.doctype.user.user.get_email_awaiting',
			args: {
				"user": user
      }
    });
    
    email_account = email_account["message"];
    if (email_account) {
      var i = 0;
      if (i < email_account.length) {
        this.email_password_prompt( email_account, user, i);
      }
    }
  }

  email_password_prompt(email_account,user,i) {
    const me = this;
		const d = new frappe.ui.Dialog({
			title: __('Email Account Setup: {0}', [email_account[i]["email_id"]]),
			fields: [
				{	'fieldname': 'password',
					'fieldtype': 'Password',
					'label': 'Email Account Password',
					'reqd': 1
				}
			],
			primary_action() {
				d.hide();

				frappe.call({
					method: 'frappe.core.doctype.user.user.set_email_password',
					args: {
						"email_account": email_account[i]["email_account"],
						"user": user,
						"password": d.get_value("password")
					},
					callback: function(r) {
						if (!r.message) {
							frappe.show_alert({
								indicator: 'red',
								message: __('Login Failed. Please try again.')
							});
							me.email_password_prompt(email_account, user, i);
							return;
						}

						frappe.show_alert({
							indicator: 'green',
							message: __('Email Account {0} configured.', [email_account[i]["email_account"]])
						});

						if (i++ < email_account.length) {
							me.email_password_prompt(email_account, user, i++);
						}
					}
				});
			}
		});
		d.show();
	}
}