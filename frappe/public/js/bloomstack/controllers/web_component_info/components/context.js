import { Component } from "../../../compose";
import { EVT_CONSTRUCT } from "../../../events";
import { EVT_COMPONENT_MOUNT, EVT_COMPONENT_UNMOUNT } from "../events";

/**
 * Provides a hierarchical api to store values between parent and child nodes.
 * Similar to react's context provider and consumer api
 */
export class ContextComponent extends Component {

  [EVT_CONSTRUCT]() {
    this.context = new Map();
    this.context_subscriptions = new Set();
    this.context_handler = (e) => {
      if ( this.context_subscriptions.has(e.context)) {
        this.parent.element.update();
      }
    }
  }

  find_context(name) {
    if ( this.context.has(name) ) {
      return this.context.get(name);
    }

    let node = this.parent.element.parentElement;
    while(node) {
      if ( Reflect.has(node, "__web_component") ) {
        return node.__web_component[ContextComponent].find_context(name);
      }
      node = node.parentElement;
    }

    return undefined;
  }

  [EVT_COMPONENT_MOUNT]() {
    this.parent.element.addEventListener("bloomstack-context-update", this.context_handler);
  }

  [EVT_COMPONENT_UNMOUNT]() {
    this.parent.element.removeEventListener("bloomstack-context-update", this.context_handler);
  }

  get_context(name) {
    const ctx = this.find_context(name);
    this.context_subscriptions.add(name);
    return ctx;
  }

  async set_context(name, value) {
    // TODO: Optimize by doing deep isEqual test to avoid triggering unecessary rendering.
    this.context.set(name, value);
    this.parent.element.dispatchEvent(new CustomEvent("bloomstack-context-update", { context: name }));
  }
}