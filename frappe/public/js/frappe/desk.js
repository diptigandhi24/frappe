// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt
/* eslint-disable no-console */

// __('Modules') __('Domains') __('Places') __('Administration') # for translation, don't remove

import { Application } from "../bloomstack/controllers/app";

$(document).ready(function() {
	if(!frappe.utils.supportsES6) {
		frappe.msgprint({
			indicator: 'red',
			title: __('Browser not supported'),
			message: __('Some of the features might not work in your browser. Please update your browser to the latest version.')
		});
	}

	frappe.assets.check();
	frappe.provide('frappe.app');
	frappe.provide('frappe.desk');
	frappe.app = new Application();//frappe.Application();
	frappe.app.init();
});