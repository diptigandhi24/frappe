import { Component } from "../compose";
import { EVT_TAG_ADDED, EVT_TAG_REMOVED, EVT_CONSTRUCT } from "../events";

/**
 * A component that adds tagging information to a controller.
 * Can be used to organize your codebase via tags/flags.
 */
export class TaggedComponent extends Component {
  [EVT_CONSTRUCT]() {
    this.tags = new Set();
  }

  /**
   * Adds a tag to the controller
   * @param {symbol} tag 
   */
  async add_tag(tag) {
    this.tags.add(tag);
    await this.broadcast(EVT_TAG_ADDED, tag);
  }

  /**
   * Removes a tag from the controller
   * @param {symbol} tag 
   */
  async remove_tag(tag) {
    this.tags.delete(tag);
    await this.broadcast(EVT_TAG_REMOVED, tag);
  }

  /**
   * Returns true when a tag exists otherwise false
   * @param {symbol} tag 
   * @returns {boolean}
   */
  has_tag(tag) {
    return this.tags.has(tag);
  }
}