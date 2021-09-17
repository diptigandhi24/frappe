// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

import { Compose } from "../../compose";
import { api_property_wrap } from "../../utils";

// route urls to their virtual pages
frappe.provide('frappe.views');

export class Router extends Compose() {

  constructor() {
    super();

    this.re_route = {"#login": ""};
    this.route_titles = {};
    this.route_flags = {};
    this.route_history = [];
    this.view_factory = {};
    this.view_factories = [];
    this.route_options = null;
    this._cur_route = null;

    const me = this;
    $(window).on('hashchange', function() {
      // save the title
      frappe.route_titles[frappe._cur_route] = frappe._original_title || document.title;
    
      if(window.location.hash==frappe._cur_route)
        return;
    
      // hide open dialog
      if(window.cur_dialog) {
        if (!cur_dialog.minimizable) {
          cur_dialog.hide();
        } else if (!cur_dialog.is_minimized) {
          cur_dialog.toggle_minimize();
        }
      }
    
      me.route();
      me.router.broadcast("change");
    });
  }

  route() {
    // Application is not yet initiated
    if (!frappe.app) return;

    if(this.re_route[window.location.hash] !== undefined) {
      // after saving a doc, for example,
      // "New DocType 1" and the renamed "TestDocType", both exist in history
      // now if we try to go back,
      // it doesn't allow us to go back to the one prior to "New DocType 1"
      // Hence if this check is true, instead of changing location hash,
      // we just do a back to go to the doc previous to the "New DocType 1"
      var re_route_val = this.get_route_str(this.re_route[window.location.hash]);
      var cur_route_val = this.get_route_str(this._cur_route);
      if (decodeURIComponent(re_route_val) === decodeURIComponent(cur_route_val)) {
        window.history.back();
        return;
      } else {
        window.location.hash = frappe.re_route[window.location.hash];
      }
    }

    this._cur_route = window.location.hash;

    var route = this.get_route();
    if (route === false) {
      return;
    }

    this.route_history.push(route);

    if(route[0]) {
      const title_cased_route = frappe.utils.to_title_case(route[0]);

      if (title_cased_route === 'Desktop') {
        frappe.views.pageview.show('');
      }

      if (route[1] && frappe.views[title_cased_route + "Factory"]) {
        // has a view generator, generate!
        if(!this.view_factory[title_cased_route]) {
          this.view_factory[title_cased_route] = new frappe.views[title_cased_route + "Factory"]();
        }

        this.view_factory[title_cased_route].show();
      } else {
        // show page
        const route_name = frappe.utils.xss_sanitise(route[0]);
        if (frappe.views.pageview) {
          frappe.views.pageview.show(route_name);
        }
      }
    } else {
      // Show desk
      frappe.views.pageview.show('');
    }


    if(this.route_titles[window.location.hash]) {
      frappe.utils.set_title(this.route_titles[window.location.hash]);
    } else {
      setTimeout(function() {
        this.route_titles[this.get_route_str()] = frappe._original_title || document.title;
      }, 1000);
    }

    if(window.mixpanel) {
      window.mixpanel.track(route.slice(0, 2).join(' '));
    }
  }

  get_route_str(route) {
    var rawRoute = this.get_raw_route_str(route);
    route = $.map(rawRoute.split('/'), this._decode_str).join('/');
    return route;
  }

  get_route(route) {
    // for app
    route = this.get_raw_route_str(route).split('/');
    route = $.map(route, this._decode_str);
    var parts = null;
    var doc_name = route[route.length - 1];
    // if the last part contains ? then check if it is valid query string
    if(doc_name.indexOf("?") < doc_name.indexOf("=")){
      parts = doc_name.split("?");
      route[route.length - 1] = parts[0];
    } else {
      parts = doc_name;
    }
    if (parts.length > 1) {
      var query_params = frappe.utils.get_query_params(parts[1]);
      this.route_options = $.extend(this.route_options || {}, query_params);
    }
  
    // backward compatibility
    if (route && route[0]==='Module') {
      frappe.set_route('modules', route[1]);
      return false;
    }
  
    return route;
  }

  get_prev_route() {
    if(this.route_history && this.route_history.length > 1) {
      return this.route_history[this.route_history.length - 2];
    } else {
      return [];
    }
  }

  _decode_str(r) {
    try {
      return decodeURIComponent(r);
    } catch(e) {
      if (e instanceof URIError) {
        return r;
      } else {
        throw e;
      }
    }
  }

  get_raw_route_str(route) {
    if(!route)
      route = window.location.hash;
  
    if(route.substr(0,1)=='#') route = route.substr(1);
    if(route.substr(0,1)=='!') route = route.substr(1);
  
    return route;
  }

  get_route_str(route) {
    var rawRoute = frappe.get_raw_route_str(route);
    route = $.map(rawRoute.split('/'), frappe._decode_str).join('/');
  
    return route;
  }

  set_route() {
    return new Promise(resolve => {
      var params = arguments;
      if(params.length===1 && $.isArray(params[0])) {
        params = params[0];
      }
      var route = $.map(params, function(a) {
        if($.isPlainObject(a)) {
          frappe.route_options = a;
          return null;
        } else {
          a = String(a);
          if (a && a.match(/[%'"]/)) {
            // if special chars, then encode
            a = encodeURIComponent(a);
          }
          return a;
        }
      }).join('/');
  
      window.location.hash = route;
  
      // Set favicon (app.js)
      frappe.provide('frappe.app');
      frappe.app.set_favicon && frappe.app.set_favicon();
      setTimeout(() => {
        frappe.after_ajax && frappe.after_ajax(() => {
          resolve();
        });
      }, 100);
    });
  }

  set_re_route() {
    var tmp = window.location.hash;
    this.set_route.apply(null, arguments);
    this.re_route[tmp] = window.location.hash;
  }

  has_route_options() {
    return Boolean(Object.keys(this.route_options || {}).length);
  }
}

// turn off init guard for max compatibility with old apis.
Router.ignore_init_guard = true;

frappe.router = Router();

// map old apis to new controller
api_wrap(frappe, "route", frappe.router);
api_wrap(frappe, "on", frappe.router);
api_wrap(frappe, "once", frappe.router);
api_wrap(frappe, "off", frappe.router);
api_wrap(frappe, "trigger", frappe.router, "broadcast");
api_wrap(frappe, "route", frappe.router);

// map old property apis to new controller
api_property_wrap(frappe, "re_reoute", frappe.router, null, true, false);
api_property_wrap(frappe, "route_titles", frappe.router, null, true, false);
api_property_wrap(frappe, "route_flags", frappe.router, null, true, false);
api_property_wrap(frappe, "route_history", frappe.router, null, true, false);
api_property_wrap(frappe, "view_factories", frappe.router, null, true, false);
api_property_wrap(frappe, "route_options", frappe.router, null, true, false);
api_property_wrap(frappe, "_cur_route", frappe.router, null, true, false);

frappe.router.init();
