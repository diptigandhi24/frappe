import { Component } from "../../../compose";

export class VueSetupComponent extends Component {
  on_boot() {
    Vue.prototype.__ = window.__;
		Vue.prototype.frappe = window.frappe;
  }  
}