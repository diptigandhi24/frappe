import { ComponentDependencies, withMixins, Component } from "../compose";
import { TaggedComponent } from "./tagged";
import {
  EVT_PARENT_CONTROLLER_SET,
  EVT_PARENT_CONTROLLER_UNSET,
  EVT_CONSTRUCT,
  EVT_BROADCAST,
  EVT_INITIALIZED
} from "../events";

/**
 * Provides parent and child organizational hierarchy support.
 * This component should be used in tandem with the ParentComponent
 * component on the parent controller.
 */
export class ChildComponent extends Component {

  [EVT_CONSTRUCT]() {
    this.parent_controller = null;
    this.bubbled_events = new Set();
  }

  /**
   * Sets the parent controller to this child. Internal use only.
   * @param {object} parent 
   */
  set_parent(parent) {
    this.parent_controller = parent;
    if ( this.parent[EVT_INITIALIZED] ) {
      this.broadcast(EVT_PARENT_CONTROLLER_SET, parent);
    }
  }

  /**
   * Unsets the parent controller to this child. Internal use only.
   */
  unset_parent() {
    this.parent_controller = null;
    if ( this.parent[EVT_INITIALIZED] ) {
      this.broadcast(EVT_PARENT_CONTROLLER_UNSET, parent);
    }
  }

  /**
   * Child controller event trap. Used to back propage events to the parent
   * where necessary. See bubble_event method for details.
   * @param {symbol} event The event triggered.
   * @param  {...any} args Event arguments.
   * @see bubble_event
   */
  async [EVT_BROADCAST](event, ...args) {
    if (this.parent_controller && this.bubbled_events.has(event)) {
      if ( this.parent[EVT_INITIALIZED] && this.parent_controller[EVT_INITIALIZED] ) {
        await this.parent_controller.broadcast(event, ...args);
      }
    }
  }

  /**
   * Forwards child controller events to its parent. Set the event to track
   * to automatically forward the event.
   * @param {symbol} event The event to forward.
   */
  bubble_event(event) {
    this.bubbled_events.add(event);
  }

  /**
   * Stops forwarding an event to the parent controller
   * @param {symbol} event The event to stop forwarding.
   */
  unbubble_event(event) {
    if (this.handlers.has(event)) {
      this.handlers.delete(event);
    }
  }
}