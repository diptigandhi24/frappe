import { Component } from "../compose";
import { ChildComponent } from "./child";
import {
  EVT_CHILD_CONTROLLER_ADDED,
  EVT_CHILD_CONTROLLER_REMOVED,
  EVT_BROADCAST,
  EVT_CONSTRUCT,
  EVT_BEFORE_INIT,
  EVT_INIT,
  EVT_AFTER_INIT,
  EVT_INITIALIZED
} from "../events";
import { TaggedComponent } from "./tagged";

/**
 * Provides parent and child organizational hierarchy support.
 * This component should be used in tandem with the ChildComponent component
 * on the child controller.
 */
export class ParentComponent extends Component {
  async [EVT_CONSTRUCT]() {
    this.child_controllers = new Set();
  }

  async [EVT_AFTER_INIT]() {
    for (const child of this.child_controllers.values()) {
      if (!child[EVT_INITIALIZED]) {
        await child.init();
      }
    }
  }

  /**
   * Parent controller broadcast trap. Used to forward broadcasts to child controllers
   * @param {symbol} event The event trapped
   * @param  {...any} args The event arguments
   */
  async [EVT_BROADCAST](event, ...args) {
    if ([EVT_CONSTRUCT, EVT_BROADCAST, EVT_INIT, EVT_BEFORE_INIT, EVT_AFTER_INIT].includes(event)) {
      return;
    }

    for (const child of Array.from(this.child_controllers.values())) {
      if (child[EVT_INITIALIZED]) {
        await child.broadcast(event, ...args);
      }
    }
  }

  /**
   * Adds a child controller to track. Child controllers receive parent event broadcasts.
   * However, child events are not back propagated to parents unless specified by the child controller.
   * @param {*} child 
   */
  async add_child_controller(child) {
    if (!child.has_component(ChildComponent)) {
      throw new Error("You can not add a child controller that does not contain the ChildComponent component");
    }
    this.child_controllers.add(child);
    child[ChildComponent].set_parent(this.parent);

    await this.broadcast(EVT_CHILD_CONTROLLER_ADDED, child);

    if (!child[EVT_INITIALIZED]) {
      await child.init();
    }
  }

  /**
   * Removes a child controller from the hierarchy.
   * @param {*} child The child controller to remove.
   */
  async remove_child_controller(child) {
    this.child_controllers.delete(child);
    child[ChildComponent].unset_parent();

    await this.broadcast(EVT_CHILD_CONTROLLER_REMOVED, child);
  }

  /**
   * Enumerates all child controllers by tags.
   * @param  {...any} tag The tags to match
   */
  find_controller_by_tag(...tags) {
    const result = [];
    for (const child of Array.from(this.child_controllers.values())) {
      let all_match = true;
      for(const tag of tags) {
        if (!child[TaggedComponent].has_tag(tag)) {
          all_match = false;
          break;
        }
      }

      if ( all_match ) {
        result.push(child);
      }
    }

    return result;
  }
}