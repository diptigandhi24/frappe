import { Compose, withMixins } from "../../compose";
import { ReactWebComponentComponent } from "./components/react_web_component";
import { BreakpointBootstrappingComponent } from "./components/breakpoint_bootstrapping";
import { BaseWebComponentComponent } from "./components/base_web_component";
import { VanillaWebComponentComponent } from "./components/vanilla_web_component";
import { ParentComponent } from "../../components/parent";

export default class WebComponentController extends Compose(
  ParentComponent,
  BreakpointBootstrappingComponent,
  BaseWebComponentComponent,
  withMixins(ReactWebComponentComponent,
    "make_react_component"
  ),
  withMixins(VanillaWebComponentComponent,
    "make_js_component"
  )
) {
}

bloomstack.web = new WebComponentController();
bloomstack.web_ready = bloomstack.web.init();

// Expose simple apis to keep wrists healthy ///////////////////////////

/**
 * Seamlessly bootstraps a web component.
 * @param {object}    config Component configuration.
 * @param {string}    config.tag The HTML Element tag name.
 * @param {array}     config.stylesheets An array of stylesheet urls to include.
 * @param {string}    config.style A string of raw css to inject into the root.
 * @param {object}    config.props An object containing component props and a function to sanitize and convert its values.
 * @param {function}  config.component A component implementation function to render
 * @param {string}    config.mode Set to "closed" to build a private shadow dom. Defaults to open.
 * @param {number}    config.render_debounce_timeout Sets a rendering debounce timeout. Defaults to 50 milliseconds.
 */
export const make_react_component = async (...args) => {
  await bloomstack.web_ready;
  return bloomstack.web.make_react_component(...args);
}
export const make_js_component = async (...args) => {
  await bloomstack.web_ready;
  return bloomstack.web.make_js_component(...args);
}