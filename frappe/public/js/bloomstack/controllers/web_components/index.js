import { Compose, withMixins } from "../../compose";
import { ReactWebComponentComponent } from "./components/react_web_component";
import { BreakpointBehaviourComponent } from "./components/breakpoint_behaviour";

export default class WebComponentController extends Compose(
  BreakpointBehaviourComponent,
  withMixins(ReactWebComponentComponent,
    "make_react_component"
  )
) {
}

bloomstack.web = new WebComponentController();
bloomstack.web.init();

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
 */
export const make_react_component = bloomstack.web.make_react_component.bind(bloomstack.web);