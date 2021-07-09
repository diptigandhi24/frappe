import { Component } from "./component";
export { Component };

/**
 * Helper function that builds a dependency tree for a component.
 * This is useful to attach extra components to a parent controller where
 * the implementing component requires access to other components.
 * @param  {...FunctionConstructor} classes
 */
export function ComponentDependencies(...classes) {
  const ComponentWithDeps = class extends Component {};
  ComponentWithDeps.dependencies = classes;
  return ComponentWithDeps;
}

/**
 * Helper function that composes multiple components into a parent controller.
 * All components will be accessible via their class symbol on the instance created
 * from an extending class.
 * @param  {...FunctionConstructor} classes
 */
export function Compose(...classes) {
  // block access to components and events to keep component clean
  // components and events will be accessible only through api
  const childComponents = new Map();
  const events = new Map();

  /**
   * Builds a sorted dependency list of component classes
   * @param {FunctionConstructor} classes
   */
  const buildDependencyList = (classes) => {
    const flatDependencies = new Set();
    const deps = [...classes];

    // safety net, do not iterate over 50 dependencies
    let max = 50;
    do {
      const cls = deps.shift();
      flatDependencies.add(cls);
      if (cls.dependencies) {
        for (const d of cls.dependencies) {
          if (!flatDependencies.has(d)) {
            deps.push(d);
          }
        }
      }
      max--;
    } while (deps.length > 0 && max > 0);

    const result = Array.from(flatDependencies.values()).sort((a, b) => {
      const aDeps = a.dependencies || [];
      const bDeps = b.dependencies || [];
      const intersection = aDeps.filter((d) => bDeps.includes(d));
      const foundInA = aDeps.filter((d) => intersection.includes(d)).length;
      const foundInB = bDeps.filter((d) => intersection.includes(d)).length;
      return foundInA - foundInB;
    });

    return result;
  };

  /**
   * Builds component symbols into the class instance to easy access
   * components using their symbol names. Also caches class symbol and instance
   * for internal usage.
   * @param {*} thisObj The compose class to inject components.
   * @param {*} classes List of component classes to instantiate and inject.
   */
  const initComponentDeps = (thisObj, classes) => {
    const dependencies = buildDependencyList(classes);
    console.info(`[compose] ${dependencies.map(d => d.name).join(',')}`)
    for (const cls of dependencies) {
      // Then Initialize components.
      const instance = new cls(thisObj);
      childComponents.set(cls, instance);
      Reflect.set(thisObj, cls, instance);
    }
  };

  /**
   * Dynamic controller class that is composed from multiple passed components.
   */
  return class {
    constructor(...args) {
      initComponentDeps(this, classes);
      this.initialized = false;
    }

    async init() {
      await this.broadcast("construct");
      await this.broadcast("init");
      this.initialized = true;
      await this.broadcast("after_init");
    }

    /**
     * Lists component instances attached to this controller
     */
    get components() {
      return childComponents.values();
    }

    /**
     * Binds a callback to an internal event.
     * @param {*} event the event name.
     * @param {*} callback A callback function.
     */
    on(event, callback) {
      if (!events.has(event)) {
        events.add(event, new Set());
      }

      events.get(event).add(callback);

      return this;
    }

    /**
     * Un-binds a callback from an internal event.
     * @param {*} event The event name.
     * @param {*} callback A callback function originally bound.
     */
    off(event, callback) {
      if (events.has(event)) {
        events.get(event).delete(callback);
      }

      return this;
    }

    /**
     * Broadcasts an event to the controller and components
     * @param {*} event The event name
     * @param {...any} args Event parameters
     */
    async broadcast(event, ...args) {
      const eventName = `on_${event}`;
      const instances = [this, ...Array.from(childComponents.values())];
      console.info(`[broadcast] ${event}/${eventName}: `, instances);

      for (const component of instances) {
        if (Reflect.has(component, eventName)) {
          const fn = Reflect.get(component, eventName);
          console.info(`[event] ${component.constructor.name}.${eventName}`)
          await Reflect.apply(fn, component, args);
        }
      }

      if (events.has(event)) {
        for (const listener of events.get(event).values()) {
          await listener(this, ...args);
        }
      }
    }
  };
}
