/**
 * Bloomstack Grafting api base component class.
 * Provides composition extensions to a controller and
 * access to the parent controller broadcast and event systems.
 */
export class Component {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Broadcasts an event to the parent controller and all sibling
   * components attached to the parent.
   * @param  {...any} args
   * @return {Promise<void>}
   */
  async broadcast(...args) {
    return await this.parent.broadcast(...args);
  }
}
