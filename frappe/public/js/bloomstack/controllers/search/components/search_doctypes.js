import { Component } from "../../../compose";

export class SearchDoctypesComponent extends Component {

  build_option(level, doctype, type, route, order, extra) {
    return {
      type: type,
      label: doctype,
      index: level + order,
      doctype,
      route: route,
      ...(extra || {})
    };
  }

  get_doctypes(keywords) {
    const parent = this.parent;
    const out = [];

    frappe.boot.user.can_read.forEach((item) => {
      const level = parent.fuzzy_search(keywords, item);
      if (level && item) {
        if (in_list(frappe.boot.single_types, item)) {
          out.push(this.build_option(level, item, "Doctype", ["Form", item, item], 0.05,{
            can_create: false
          }));
        } else if (frappe.boot.user.can_search.includes(item)) {
          if (in_list(frappe.boot.treeviews, item)) {
            out.push(this.build_option(level, item, "Tree", ["Tree", item], 0.05));

          } else {
            const can_create = frappe.boot.user.can_search.includes(item);
            out.push(this.build_option(level, item, "Doctype", ["List", item], 0.05, {
              can_create
            }));
            if (frappe.model.can_get_report(item)) {
              out.push(this.build_option(level, item, "Report", ["List", item, "Report"], 0.04));
            }
          }
        }
      }
    });

    return out;
  }
}