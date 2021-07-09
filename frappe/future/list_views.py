import frappe

from frappe import whitelist;

@whitelist()
def get_list_view_display_info(doctype):
	"""Fetches list view meta data information"""

	meta = frappe.get_meta(doctype)

	list_view_fields = [d for d in meta.fields if d.in_list_view]

	# build abbreviated list view meta information
	list_meta = {
		"dt": meta.name,
		"columns": list_view_fields
	}