import { EVT_BUILD_STORE } from "../events";
import { EVT_INIT } from "../../../events";

export class SearchFrequentlyVisited extends Component {
  [EVT_INIT]() {
    frappe.route.on('change', () => {
    });
  }

  [EVT_BUILD_STORE](out) {
    // get_recent_pages(keywords) {
    //   if (keywords === null) keywords = '';
    //   var me = this, values = [], options = [];
  
    //   function find(list, keywords, process) {
    //     list.forEach(function(item, i) {
    //       var _item = ($.isArray(item)) ? item[0] : item;
    //       _item = __(_item || '').toLowerCase().replace(/-/g, " ");
  
    //       if(keywords===_item || _item.indexOf(keywords) !== -1) {
    //         var option = process(item);
  
    //         if(option) {
    //           if($.isPlainObject(option)) {
    //             option = [option];
    //           }
    //           option.forEach(function(o) {
    //             o.match = item; o.recent = true;
    //           });
  
    //           options = option.concat(options);
    //         }
    //       }
    //     });
    //   }
  
    //   me.recent.forEach(function(doctype, i) {
    //     values.push([doctype[1], ['Form', doctype[0], doctype[1]]]);
    //   });
  
    //   values = values.reverse();
  
    //   frappe.route_history.forEach(function(route, i) {
    //     if(route[0]==='Form') {
    //       values.push([route[2], route]);
    //     } else if(['List', 'Tree', 'modules', 'query-report'].includes(route[0]) || route[2]==='Report') {
    //       if(route[1]) {
    //         values.push([route[1], route]);
    //       }
    //     } else if(route[0]) {
    //       values.push([frappe.route_titles[route.join('/')] || route[0], route]);
    //     }
    //   });
  
    //   find(values, keywords, function(match) {
    //     var out = {
    //       route: match[1]
    //     };
    //     if (match[1][0]==='Form') {
    //       if (match[1].length > 2 && match[1][1] !== match[1][2]) {
    //         out.label = __(match[1][1]) + " " + match[1][2].bold();
    //         out.value = __(match[1][1]) + " " + match[1][2];
    //       } else {
    //         out.label = __(match[1][1]).bold();
    //         out.value = __(match[1][1]);
    //       }
    //     } else if (['List', 'Tree', 'modules', 'query-report'].includes(match[1][0]) && (match[1].length > 1)) {
    //       var type = match[1][0], label = type;
    //       if(type==='modules') label = 'Module';
    //       else if(type==='query-report' || match[1][2] ==='Report') label = 'Report';
    //       out.label = __(match[1][1]).bold() + " " + __(label);
    //       out.value = __(match[1][1]) + " " + __(label);
    //     } else if (match[0]) {
    //       out.label = match[0].bold();
    //       out.value = match[0];
    //     } else {
    //       // eslint-disable-next-line
    //       console.log('Illegal match', match);
    //     }
    //     out.index = 80;
    //     return out;
    //   });
  
    //   return options;
    // }
  }
}