import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

export class ShowNotesComponents extends ComponentDependencies(BootInfoComponent) {
	on_show_notes() {
		if (frappe.boot.notes.length) {
			for (const note of frappe.boot.notes) {
				if (!note.seen || note.notify_on_every_login) {
					var d = frappe.msgprint({ message: note.content, title: note.title });
					d.keep_open = true;
					d.custom_onhide = () => {
						note.seen = true;

						// Mark note as read if the Notify On Every Login flag is not set
						if (!note.notify_on_every_login) {
							frappe.call({
								method: "frappe.desk.doctype.note.note.mark_as_seen",
								args: {
									note: note.name
								}
							});
						}

						// next note
						this.broadcast("show_notes");
					};
				}
				break;
			};
		}
	}
}