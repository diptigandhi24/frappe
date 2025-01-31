function generate_grid(data) {
	const grid_max_cols = 6;

	// Split the data into multiple arrays
	// Each array will contain grid elements of one row
	let processed = [];
	let temp = [];
	let init = 0;
	data.forEach((data) => {
		init = init + data.columns;
		if (init > grid_max_cols) {
			init = data.columns;
			processed.push(temp);
			temp = [];
		}
		temp.push(data);
	});

	processed.push(temp);

	let grid_template = [];

	processed.forEach((data, index) => {
		let aa = data.map(dd => {
			return Array.apply(null, Array(dd.columns)).map(String.prototype.valueOf, dd.name);
		}).flat();

		if (aa.length < grid_max_cols) {
			let diff = grid_max_cols - aa.length;
			for (let ii = 0; ii < diff; ii++) {
				aa.push(`grid-${index}-${ii}`);
			}
		}

		grid_template.push(aa.join(" "));
	});
	let grid_template_area = "";

	grid_template.forEach(temp => {
		grid_template_area += `"${temp}" `;
	});

	return grid_template_area;
}

const build_summary_item = (summary) => {
	let df = {fieldtype: summary.datatype};
	let doc = null;

	if (summary.datatype == "Currency") {
		df.options = "currency";
		doc = {currency: summary.currency};
	}

	let value = frappe.format(summary.value, df, null, doc);
	let indicator = summary.indicator ? `indicator ${ summary.indicator.toLowerCase() }` : '';

	return $(`<div class="summary-item">
		<span class="summary-label small text-muted ${indicator}">${summary.label}</span>
		<h1 class="summary-value">${ value }</h1>
	</div>`);
};

function go_to_list_with_filters(doctype, filters) {
	const route = `List/${doctype}/List`;
	frappe.set_route(route).then(()=> {
		let list_view = frappe.views.list_view[route];
		let filter_area = list_view.filter_area;
		filter_area.clear();
		filter_area.filter_list.add_filters_to_filter_group(filters);
	});
}

function shorten_number(number) {
	let x = Math.abs(Math.round(number));

	switch (true) {
		case x >= 1.0e+12:
			return Math.round(number/1.0e+12) + " T";
		case x >= 1.0e+9:
			return Math.round(number/1.0e+9) + " B";
		case x >= 1.0e+6:
			return Math.round(number/1.0e+6) + " M";
		default:
			return number.toFixed();
	}
}

export { generate_grid, build_summary_item, go_to_list_with_filters, shorten_number };