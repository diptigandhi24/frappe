import { Component } from "../../../component";

export class ModulesComponent extends Component {
  get_module(m, default_module) {
    let module = frappe.modules[m] || default_module;
    if (!module) {
      return;
    }
  
    if(module._setup) {
      return module;
    }
  
    if(module.type==="module" && !module.link) {
      module.link = "modules/" + module.module_name;
    }
  
    if(module.type==="list" && !module.link) {
      module.link = "List/" + module._doctype;
    }
  
    if (!module.link) module.link = "";
  
    if (!module._id) {
      // links can have complex values that range beyond simple plain text names, and so do not make for robust IDs.
      // an example from python: "link": r"javascript:eval('window.open(\'timetracking\', \'_self\')')"
      // this snippet allows a module to open a custom html page in the same window.
      module._id = module.module_name.toLowerCase();
    }
  
  
    if(!module.label) {
      module.label = m;
    }
  
    if(!module._label) {
      module._label = __(module.label);
    }
  
    if(!module._doctype) {
      module._doctype = '';
    }
  
    module._setup = true;
  
    return module;
  }; 
}