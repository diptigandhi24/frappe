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

  async on(...args) {
    return await this.parent.on(...args);
  }

  async off(...args) {
    return await this.parent.off(...args);
  }
}