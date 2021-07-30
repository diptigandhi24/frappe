import { Component } from "../../../component";
import { find_element_breakpoint } from "../../../web_components/utils";

export class BreakpointBehaviourComponent extends Component {
  on_build_observed_attributes(config, observedAttributes) {
    console.log("TODO: Build breakpoint attributes...");
  }

  on_update(element, config, propsMap) {
    if (config.props) {
      // re-assess prop values with breakpoints
      const breakpoint = find_element_breakpoint(element.parentNode);
      for (const key of Object.keys(config.props)) {
        const bpKey = `[${breakpoint.name}]${key}`;
        if (Reflect.get(element, bpKey)) {
          console.log("------------------------------------")
          console.log(config.tag, " Set Break point att: ", bpKey, key, Reflect.get(element, bpKey));
          propsMap.set(key, Reflect.get(element, bpKey));
          console.log("------------------------------------")
        }
      }
    }
  }
}