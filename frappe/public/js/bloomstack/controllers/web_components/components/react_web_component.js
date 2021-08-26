import { Component } from "../../../component";
import { list_breakpoints, find_element_breakpoint } from "../../../web_components/utils";
import { ComponentDependencies } from "../../../compose";
import { BaseWebComponentComponent } from "./base_web_component";

export class ReactWebComponentComponent extends ComponentDependencies(BaseWebComponentComponent) {
  on_react_render(component, props) {
    const Renderer = component.config.component;
    ReactDOM.render(<Renderer {...props} />, component.mountpoint);
    return true;
  }

  on_react_unmount(component) {
    ReactDOM.unmountComponentAtNode(component.mountpoint);
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
  async make_react_component(config) {
    const observedAttributes = [
      ...Object.keys(config.props || {})
    ];
    config.type = "react";
    await this.broadcast("build_observed_attributes", config, observedAttributes);
    await this.broadcast("build_web_component", config, observedAttributes)
  }
}