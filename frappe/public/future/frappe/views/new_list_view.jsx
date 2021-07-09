import React from 'react';
import ReactDOM from 'react-dom';

import NewList from '../components/views/newList';

frappe.provide('frappe.views');

frappe.views.NewListView = class NewListView extends frappe.views.ListView {
	get view_name() {
		return 'NewList';
	}

	refresh() {
		this.render();
	}

	setup_view() {
	}

	setup_main_section() {
	}

	render() {
		this.set_title();
		ReactDOM.render(<NewList/>, this.page.main.get(0));
	}
}