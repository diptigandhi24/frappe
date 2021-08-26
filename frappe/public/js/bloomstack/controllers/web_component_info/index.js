import { ChildComponent } from "../../components/child";
import { TaggedComponent } from "../../components/tagged";
import { Compose, withMixins } from "../../compose";
import { TAG_INITIALIZED, TAG_MOUNTED } from "../../tags";
import { EVT_INIT, EVT_CONSTRUCT, EVT_AFTER_INIT } from "../../events";
import { EVT_COMPONENT_UPDATE, EVT_COMPONENT_MOUNT } from "./events";
import { EVT_UPDATE, EVT_MOUNT } from "../web_components/events";
import { BreakpointSupportComponent } from "./components/breakpoint_support";
import { ContextComponent } from "./components/context";

/**
 * A facade controller for web components. Abstracts implementation details from different
 * libraries.
 */
export class WebComponentInfo extends Compose(
  ChildComponent,
  TaggedComponent,
  withMixins(BreakpointSupportComponent,
    "update_breakpoint"
  ),
  withMixins(ContextComponent,
    "get_context",
    "set_context"
  )
) {
  [EVT_CONSTRUCT](element, shadow, config) {
    this.element = element;
    this.shadow = shadow;
    this.config = config;
    this.props = new Map();
    this.types = new Map();
    this.pause_rendering = 0;
  }

  /**
   * Track an attribute and its data converter.
   * @param {*} name The attribute name.
   * @param {*} converter A function to convert any passed value to its final type.
   */
  define_attribute(name, converter) {
    this.types.set(name, converter);
  }

  /**
   * Returns true if component can render. Otherwise, rendering is paused.
   */
  get can_render() {
    return this.pause_rendering > 0;
  }

  /**
   * Returns true if component is ready
   */
  get initialized() {
    return this[TaggedComponent].has_tag(TAG_INITIALIZED);
  }

  /**
   * Returns true if component is mounted
   */
  get is_mounted() {
    console.log(this.components);
    return this[TaggedComponent].has_tag(TAG_MOUNTED);
  }

  /**
   * Handles event init process
   */
  async [EVT_INIT]() {
    await this[TaggedComponent].add_tag(TAG_INITIALIZED);
  }

  /**
   * Helper method, pauses rendering then runs an async callback. At the end of the call resumes rendering
   * by calling the component's update method.
   * @param {function} callback 
   */
  async with_update(callback) {
    this.pause_rendering++;
    try {
      await callback(this);
    } finally {
      this.pause_rendering--;
    }
    await this.element.update();
  }

  /**
   * Sets an attribute on the component
   * @param {string} name The attribute name
   * @param {*} value The attribute value
   */
  async set_attribute(name, value) {
    const conv = this.types.get(name);
    if ( typeof conv === "function" ) {
      value = conv(value);
    }

    const current_value = this.props.get(name);
    if ( value != current_value ) {
      this.props.set(name, value);
      await this.broadcast("set_attribute", this, name, current_value, value);
      await this.element.update();
    }
  }

  /**
   * Returns an attribute value
   * @param {string} key 
   */
  get_attribute(key) {
    return this.props.get(key);
  }

  /**
   * Listens for update events from teh web component controller.
   * Upon finding an update event for this controller, will trigger an internal broadcast
   * to internal components.
   * @param {*} component 
   */
  [EVT_UPDATE](component) {
    if ( component === this) {
      this.broadcast(EVT_COMPONENT_UPDATE);
    }
  }

  [EVT_MOUNT](component) {
    if ( component === this) {
      this.broadcast(EVT_COMPONENT_MOUNT);
    }
  }
}