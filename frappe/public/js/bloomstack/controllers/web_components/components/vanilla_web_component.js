import { Component } from "../../../component";
import { list_breakpoints, find_element_breakpoint } from "../../../web_components/utils";
import { ComponentDependencies } from "../../../compose";
import { BaseWebComponentComponent } from "./base_web_component";
import { call_if_exists } from "../../../utils";

export class VanillaWebComponentComponent extends ComponentDependencies(BaseWebComponentComponent) {
  on_vanilla_render(element, config, props, mountpoint) {
    call_if_exists(config.component, props, mountpoint);
    return true;
  }

  on_vanilla_mount(element, config, props, mountpoint) {
    call_if_exists(config.mount, props, mountpoint);
  }

  on_vanilla_unmount(element, config, mountpoint) {
    call_if_exists(config.unmount, mountpoint);
    return true;
  }

  /**
   * Seamlessly bootstraps a web component.
   * @param {object}    config Component configuration.
   * @param {string}    config.tag The HTML Element tag name.
   * @param {array}     config.stylesheets An array of stylesheet urls to include.
   * @param {string}    config.style A string of raw css to inject into the root.
   * @param {object}    config.props An object containing component props and a function to sanitize and convert its values.
   * @param {function}  config.component A component implementation function to render
   * @param {string}    config.mode Set to "closed" to build a private shadow dom. Defaults to open.
   */
  async make_js_component(config) {
    const _broadcast = this.broadcast.bind(this);
    const _shadowStore = this.shadowStore;
    const _propStore = this.propStore;
    const _initializedStore = this.initializedStore;
    const _observedAttributes = [
      ...Object.keys(config.props || {})
    ];
    config.type = "vanilla";
    await this.broadcast("build_observed_attributes", config, _observedAttributes);
    await this.broadcast("build_web_component", config, _observedAttributes)
  }
}