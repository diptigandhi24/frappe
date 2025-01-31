# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import datetime
import json
from frappe.utils.dashboard import cache_source
from frappe.utils import nowdate, getdate, get_datetime, cint, now_datetime, add_years
from frappe.utils.dateutils import\
	get_period, get_period_beginning, get_from_date_from_timespan, get_dates_from_timegrain
from frappe.model.naming import append_number_if_name_exists
from frappe.boot import get_allowed_reports
from frappe.model.document import Document
from frappe.modules.export_file import export_to_files
from frappe.utils.safe_exec import safe_exec


def get_permission_query_conditions(user):

	if not user:
		user = frappe.session.user

	if user == 'Administrator':
		return

	roles = frappe.get_roles(user)
	if "System Manager" in roles:
		return None

	doctype_condition = False
	report_condition = False

	allowed_doctypes = [frappe.db.escape(doctype) for doctype in frappe.permissions.get_doctypes_with_read()]
	allowed_reports = [frappe.db.escape(key) if isinstance(key, str) else key.encode('UTF8') for key in get_allowed_reports()]

	if allowed_doctypes:
		doctype_condition = '`tabDashboard Chart`.`document_type` in ({allowed_doctypes})'.format(
			allowed_doctypes=','.join(allowed_doctypes))
	if allowed_reports:
		report_condition = '`tabDashboard Chart`.`report_name` in ({allowed_reports})'.format(
			allowed_reports=','.join(allowed_reports))

	return '''
			(`tabDashboard Chart`.`chart_type` in ('Count', 'Sum', 'Average')
			and {doctype_condition})
			or
			(`tabDashboard Chart`.`chart_type` = 'Report'
			and {report_condition})
		'''.format(
			doctype_condition=doctype_condition,
			report_condition=report_condition
		)


def has_permission(doc, ptype, user):
	roles = frappe.get_roles(user)
	if "System Manager" in roles:
		return True


	if doc.chart_type == 'Report':
		allowed_reports = [key if isinstance(key, str) else key.encode('UTF8') for key in get_allowed_reports()]
		if doc.report_name in allowed_reports:
			return True
	else:
		allowed_doctypes = [frappe.permissions.get_doctypes_with_read()]
		if doc.document_type in allowed_doctypes:
			return True

	return False

@frappe.whitelist()
@cache_source
def get(chart_name = None, chart = None, no_cache = None, filters = None, or_filters = None, from_date = None,
	to_date = None, timespan = None, time_interval = None, heatmap_year=None, refresh = None):
	if chart_name:
		chart = frappe.get_doc('Dashboard Chart', chart_name)
	else:
		chart = frappe._dict(frappe.parse_json(chart))

	heatmap_year = heatmap_year or chart.heatmap_year
	timespan = timespan or chart.timespan

	if timespan == 'Select Date Range':
		if from_date and len(from_date):
			from_date = get_datetime(from_date)
		else:
			from_date = chart.from_date

		if to_date and len(to_date):
			to_date = get_datetime(to_date)
		else:
			to_date = get_datetime(chart.to_date)

	timegrain = time_interval or chart.time_interval
	filters = frappe.parse_json(filters) or frappe.parse_json(chart.filters_json)
	if not filters:
		filters = []

	or_filters = frappe.parse_json(or_filters) or frappe.parse_json(chart.or_filters_json)
	if not or_filters:
		or_filters = []

	# don't include cancelled documents
	filters.append([chart.document_type, 'docstatus', '<', 2, False])

	if chart.chart_type == 'Group By':
		chart_config = get_group_by_chart_config(chart, filters, or_filters)
	elif chart.type == 'Heatmap':
		chart_config = get_heatmap_chart_config(chart, filters, or_filters, heatmap_year)
	else:
		chart_config = get_chart_config(chart, filters, or_filters, timespan, timegrain, from_date, to_date)

	return chart_config

@frappe.whitelist()
def create_dashboard_chart(args):
	args = frappe.parse_json(args)
	doc = frappe.new_doc('Dashboard Chart')

	doc.update(args)

	if args.get('custom_options'):
		doc.custom_options = json.dumps(args.get('custom_options'))

	if frappe.db.exists('Dashboard Chart', args.chart_name):
		args.chart_name = append_number_if_name_exists('Dashboard Chart', args.chart_name)
		doc.chart_name = args.chart_name
	doc.insert(ignore_permissions=True)
	return doc

@frappe.whitelist()
def create_report_chart(args):
	doc = create_dashboard_chart(args)
	args = frappe.parse_json(args)
	args.chart_name = doc.chart_name
	if args.dashboard:
		add_chart_to_dashboard(json.dumps(args))

@frappe.whitelist()
def add_chart_to_dashboard(args):
	args = frappe.parse_json(args)

	dashboard = frappe.get_doc('Dashboard', args.dashboard)
	dashboard_link = frappe.new_doc('Dashboard Chart Link')
	dashboard_link.chart = args.chart_name or args.name

	if args.set_standard and dashboard.is_standard:
		chart = frappe.get_doc('Dashboard Chart', dashboard_link.chart)
		chart.is_standard = 1
		chart.module = dashboard.module
		chart.save()

	dashboard.append('charts', dashboard_link)
	dashboard.save()
	frappe.db.commit()

def get_chart_config(chart, filters, or_filters, timespan, timegrain, from_date, to_date):
	if not from_date:
		from_date = get_from_date_from_timespan(to_date, timespan)
		from_date = get_period_beginning(from_date, timegrain)
	if not to_date:
		to_date = now_datetime()

	doctype = chart.document_type
	datefield = chart.based_on
	aggregate_function = get_aggregate_function(chart.chart_type)
	value_field = chart.value_based_on or '1'
	from_date = from_date.strftime('%Y-%m-%d')
	to_date = to_date

	date_filters = [
		[doctype, datefield, '>=', from_date, False],
		[doctype, datefield, '<=', to_date, False]
	]

	if chart.chart_type == "Script" and chart.script:
		doc = {
			"chart": chart,
			"aggregate_function": aggregate_function,
			"value_field": value_field,
			"filters": filters + date_filters,
			"or_filters": or_filters,
			"datefield": datefield,
			"timegrain": timegrain,
			"from_date": from_date,
			"to_date": to_date,
			"data": []
		}
		safe_exec(chart.script, None, doc)

		return doc.get("data")

	result = get_data(doctype, datefield, aggregate_function, value_field, timegrain, from_date, to_date, filters, or_filters, date_filters)

	chart_config = {
		"labels": [get_period(r[0], timegrain) for r in result],
		"datasets": [{
			"name": "{0} - {1}".format(getdate(from_date), getdate(to_date)),
			"values": [r[1] for r in result]
		}]
	}

	if chart.show_previous_data:
		previous_result = get_previous_data(doctype, datefield, aggregate_function, value_field, timegrain, from_date,
			to_date, filters, or_filters, date_filters)

		chart_config["datasets"].append({
			"name": "{0} - {1}".format(getdate(from_date), getdate(to_date)),
			"values": [r[1] for r in previous_result]
		})

	return chart_config

def get_data(doctype, datefield, aggregate_function, value_field, timegrain, from_date, to_date, filters, or_filters, date_filters):
	data = frappe.db.get_list(
		doctype,
		fields = [
			'{} as _unit'.format(datefield),
			'{aggregate_function}({value_field})'.format(aggregate_function=aggregate_function, value_field=value_field),
		],
		filters = filters + date_filters,
		or_filters = or_filters,
		group_by = '_unit',
		order_by = '_unit asc',
		as_list = True,
		ignore_ifnull = True
	)

	return get_result(data, timegrain, from_date, to_date)

def get_previous_data(doctype, datefield, aggregate_function, value_field, timegrain, from_date, to_date, filters, or_filters, date_filters):
	"""
		Get corresponding data for previous year with the same timespan
	"""
	from_date = add_years(from_date, -1)
	to_date = add_years(to_date, -1)

	date_filters = [
		[doctype, datefield, '>=', from_date, False],
		[doctype, datefield, '<=', to_date, False]
	]

	return get_data(doctype, datefield, aggregate_function, value_field, timegrain, from_date, to_date, filters, or_filters, date_filters)

def get_heatmap_chart_config(chart, filters, or_filters, heatmap_year):
	aggregate_function = get_aggregate_function(chart.chart_type)
	value_field = chart.value_based_on or '1'
	doctype = chart.document_type
	datefield = chart.based_on
	year = cint(heatmap_year) if heatmap_year else getdate(nowdate()).year
	year_start_date = datetime.date(year, 1, 1).strftime('%Y-%m-%d')
	next_year_start_date = datetime.date(year + 1, 1, 1).strftime('%Y-%m-%d')

	filters.append([doctype, datefield, '>', "{date}".format(date=year_start_date), False])
	filters.append([doctype, datefield, '<', "{date}".format(date=next_year_start_date), False])

	if frappe.db.db_type == 'mariadb':
		timestamp_field = 'unix_timestamp({datefield})'.format(datefield=datefield)
	else:
		timestamp_field = 'extract(epoch from timestamp {datefield})'.format(datefield=datefield)

	data = dict(frappe.db.get_all(
		doctype,
		fields = [
			timestamp_field,
			'{aggregate_function}({value_field})'.format(aggregate_function=aggregate_function, value_field=value_field),
		],
		filters = filters,
		or_filters = or_filters,
		group_by = 'date({datefield})'.format(datefield=datefield),
		as_list = 1,
		order_by = '{datefield} asc'.format(datefield=datefield),
		ignore_ifnull = True
	))

	chart_config = {
		'labels': [],
		'dataPoints': data,
	}
	return chart_config

def get_group_by_chart_config(chart, filters, or_filters):

	aggregate_function = get_aggregate_function(chart.group_by_type)
	value_field = chart.aggregate_function_based_on or '1'
	group_by_field = chart.group_by_based_on
	doctype = chart.document_type

	# don't include documents where Group By Based On has Null values 
	filters.append([doctype, group_by_field, "!=", ""])
	
	data = frappe.db.get_list(
		doctype,
		fields = [
			'{} as name'.format(group_by_field),
			'{aggregate_function}({value_field}) as count'.format(aggregate_function=aggregate_function, value_field=value_field),
		],
		filters = filters,
		or_filters = or_filters,
		group_by = group_by_field,
		order_by = 'count desc',
		ignore_ifnull = True
	)

	if data:
		if chart.number_of_groups and chart.number_of_groups < len(data):
			if chart.number_of_groups > 0 and chart.show_others:
				other_count = 0
				for i in range(chart.number_of_groups - 1, len(data)):
					other_count += data[i]['count']
				data = data[0: chart.number_of_groups - 1]
				data.append({'name': 'Other', 'count': other_count})
			else:
				data = data[0: chart.number_of_groups]

		chart_config = {
			"labels": [item['name'] if item['name'] else 'Not Specified' for item in data],
			"datasets": [{
				"name": chart.name,
				"values": [item['count'] for item in data]
			}]
		}

		return chart_config
	else:
		return None


def get_aggregate_function(chart_type):
	return {
		"Sum": "SUM",
		"Count": "COUNT",
		"Average": "AVG",
		"Script": None
	}[chart_type]


def get_result(data, timegrain, from_date, to_date):
	dates = get_dates_from_timegrain(from_date, to_date, timegrain)
	result = [[date, 0] for date in dates]
	data_index = 0
	if data:
		for i, d in enumerate(result):
			while data_index < len(data) and getdate(data[data_index][0]) <= d[0]:
				d[1] += data[data_index][1]
				data_index += 1

	return result

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_charts_for_user(doctype, txt, searchfield, start, page_len, filters):
	or_filters = {'owner': frappe.session.user, 'is_public': 1}
	return frappe.db.get_list('Dashboard Chart',
		fields=['name'],
		filters=filters,
		or_filters=or_filters,
		as_list = 1)

class DashboardChart(Document):

	def on_update(self):
		frappe.cache().delete_key('chart-data:{}'.format(self.name))
		if frappe.conf.developer_mode and self.is_standard:
			export_to_files(record_list=[['Dashboard Chart', self.name]], record_module=self.module)


	def validate(self):
		if not frappe.conf.developer_mode and self.is_standard:
			frappe.throw('Cannot edit Standard charts')
		if self.chart_type != 'Custom' and self.chart_type != 'Report':
			self.check_required_field()
			self.check_document_type()

		self.validate_custom_options()
		self.validate_filters()

	def check_required_field(self):
		if not self.document_type:
				frappe.throw(_("Document type is required to create a dashboard chart"))

		if self.chart_type == "Script":
			return

		if self.chart_type == 'Group By':
			if not self.group_by_based_on:
				frappe.throw(_("Group By field is required to create a dashboard chart"))
			if self.group_by_type in ['Sum', 'Average'] and not self.aggregate_function_based_on:
				frappe.throw(_("Aggregate Function field is required to create a dashboard chart"))
		else:
			if not self.based_on:
				frappe.throw(_("Time series based on is required to create a dashboard chart"))

	def check_document_type(self):
		if frappe.get_meta(self.document_type).issingle:
			frappe.throw(_("You cannot create a dashboard chart from single DocTypes"))

	def validate_custom_options(self):
		if self.custom_options:
			try:
				json.loads(self.custom_options)
			except ValueError as error:
				frappe.throw(_("Invalid json added in the custom options: {0}").format(error))

	def validate_filters(self):
		if not self.filters_json:
			self.filters_json = "{}" if self.chart_type == "Report" else "[]"

		if not self.or_filters_json:
			self.or_filters_json = "{}" if self.chart_type == "Report" else "[]"
