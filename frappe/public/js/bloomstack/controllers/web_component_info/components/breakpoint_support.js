import { Component } from "../../../compose";
import { EVT_COMPONENT_UPDATE } from "../events";
import { find_breakpoint_by_size } from "../../../web_components/utils";

export class BreakpointSupportComponent extends Component {
  update_breakpoint() {
    // TODO: Trigger updates only if breakpoints are defined
    this.parent.element.update();
  }

  /**
   * Returns a breakpoint object if the attribute matching that breakpoint exists.
   * @param {*} idx The breakpoint index to look for.
   * @param {*} attr The attribute name.
   * @returns {object | null}
   */
  has_breakpoint_attr_by_index(idx, attr) {
    const bp = bloomstack.breakpoints[idx];
    const bp_prop = `[${bp.name}]${attr}`;

    if ( this.parent.element.hasAttribute(bp_prop) ) {
      return bp;
    }

    return null;
  }

  /**
   * Finds the breakpoint object to apply to the provided attribute.
   * @param {*} attr 
   * @param {*} breakpoint 
   */
  find_attr_closest_breakpoint(attr, breakpoint) {
    // get breakpoint index
    const bp_index = bloomstack.breakpoints.indexOf(breakpoint);

    // look forwards to find a closest match
    for(let idx = bp_index; idx < bloomstack.breakpoints.length; idx++) {
      const bp = this.has_breakpoint_attr_by_index(idx, attr);
      if ( bp ) {
        return bp;
      }
    }

    // look backwards to find the closest match
    for(let idx = bp_index; idx >= 0; idx--) {
      const bp = this.has_breakpoint_attr_by_index(idx, attr);
      if ( bp ) {
        return bp;
      }
    }
    return undefined;
  }

  [EVT_COMPONENT_UPDATE]() {
    const breakpoint = find_breakpoint_by_size(window.innerWidth);

    if (this.parent.config.props) {
      if ( breakpoint ) {
        // loop through all attributes to update breakpoint values
        for (const prop of Object.keys(this.parent.config.props)) {
          // find the closest breakpoint attribute matching the current breakpoint
          const attr_breakpoint = this.find_attr_closest_breakpoint(prop, breakpoint);

          if ( attr_breakpoint ) {
            const bp_prop = `[${attr_breakpoint.name}]${prop}`;
            const bp_prop_value = this.parent.element.getAttribute(bp_prop);
            this.parent.set_attribute(prop, bp_prop_value);
          }
        }
      }
    }
  } 
}