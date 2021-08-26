import { Component } from "./component";
import { EVT_BROADCAST, EVT_CONSTRUCT, EVT_INIT, EVT_AFTER_INIT, EVT_BEFORE_INIT, EVT_INITIALIZED } from "./events";
export { Component };

/**
 * Helper function that builds a dependency tree for a component.
 * This is useful to attach extra components to a parent controller where
 * the implementing component requires access to other components.
 * @param  {...FunctionConstructor} classes
 */
export function ComponentDependencies(...classes) {
  const ComponentWithDeps = class extends Component { };
  ComponentWithDeps.dependencies = classes;
  return ComponentWithDeps;
}

export function withMixins(constructor, ...methods) {
  return [constructor, methods];
}

/**
 * Helper function that composes multiple components into a parent controller.
 * All components will be accessible via their class symbol on the instance created
 * from an extending class.
 * @param  {...FunctionConstructor} classes
 */
export function Compose(...in_classes) {
  // block access to components and events to keep component clean
  // components and events will be accessible only through api
  const classes = [];
  const mixin_map = in_classes.reduce((p, c) => {
    if (c && c.constructor && c.constructor === Array) {
      const [cls, rest] = c;
      p.set(cls, rest);
      classes.push(cls);
    } else {
      classes.push(c);
    }

    return p;
  }, new Map());

  /**
   * Builds a sorted dependency list of component classes
   * @param {FunctionConstructor} classes
   */
  const build_dependency_list = (classes) => {
    const flat_dependencies = new Set();
    const deps = [...classes];

    // safety net, do not iterate over 50 dependencies
    let max = 50;
    do {
      const cls = deps.shift();
      if (cls) {
        flat_dependencies.add(cls);
        if (cls.dependencies) {
          for (const d of cls.dependencies) {
            let dep = d;
            if (d.constructor && d.constructor === Array) {
              dep = d[0];
            }

            if (!flat_dependencies.has(dep)) {
              deps.push(dep);
            }
          }
        }
        max--;
      }
    } while (deps.length > 0 && max > 0);

    const result = Array.from(flat_dependencies.values()).sort((a, b) => {
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
   * @param {*} controller The compose class to inject components.
   * @param {*} classes List of component classes to instantiate and inject.
   */
  const build_component_deps_keys = (controller, classes) => {
    const dependencies = build_dependency_list(classes);
    for (const cls of dependencies) {
      // Then Initialize components.
      const instance = new cls(controller);
      controller.__component_types.add(cls);
      controller.__components.set(cls, instance);
      Reflect.set(controller, cls, instance);
    }
  };

  /**
   * Dynamic controller class that is composed from multiple passed components.
   */
  return class {
    constructor(...args) {
      this.__construct_args = args;
      this.__initialized = false;
      this.__events = new Map();
      this.__components = new WeakMap();
      this.__component_types = new Set();
      this.broadcast_history = [];
      build_component_deps_keys(this, classes);

      // syntetic method wrapping for mixins to keep bindins intact
      const synthetic = function (thisArg, cls, method) {
        return (function (...args) {
          const component = Reflect.get(this, cls);
          const fn = Reflect.get(component, method);
          return Reflect.apply(fn, component, args);
        }).bind(thisArg);
      }

      // Mixin desired component methods
      for (const [cls, mixins] of Array.from(mixin_map.entries())) {
        for (const method of mixins) {
          if (!Reflect.has(this, method)) {
            Reflect.set(this, method, synthetic(this, cls, method));
          }
        }
      }

      const me = this;
      const members = new Map();
      const api_members = ["init", "broadcast", "on", "off", "one", "wait", "has_component", EVT_CONSTRUCT, EVT_BEFORE_INIT, EVT_INIT, EVT_AFTER_INIT];
      return new Proxy(this, {
        get: (target, prop, receiver) => {
          const member = Reflect.get(target, prop, receiver);
          if ( api_members.includes(prop) ) {
            return member;
          }

          if ( typeof member === "function" ) {
            if ( !members.has(member) ) {
              members.set(member, new Proxy(member, {
                apply: (target, thisArg, args) => {
                  if ( !this.__initialized ) {
                    throw new Error(`[${thisArg.constructor.name}.${target.name}] Can not call controller member until after init.`);
                  }
        
                  return Reflect.apply(target, thisArg, args);
                }
              }));
            }

            return members.get(member);
          }

          return member;
        }
      })
    }

    async init() {
      if ( this.__initialized ) {
        return;
      }

      // alert components setup internal states
      await this.broadcast(EVT_CONSTRUCT, ...this.__construct_args);
      // alert components we are about to initialize controller
      await this.broadcast(EVT_BEFORE_INIT);
      this.__initialized = true;
      // alert components we are initializing
      await this.broadcast(EVT_INIT);
      // alert components we are done with initialization
      await this.broadcast(EVT_AFTER_INIT);
    }

    get [EVT_INITIALIZED]() {
      return this.__initialized;
    }

    /**
     * Lists component instances attached to this controller
     */
    get components() {
      const result = [];
      for(const component_type of Array.from(this.__component_types.values())) {
        result.push(this.__components.get(component_type));
      }
      return result;
    }

    has_component(component) {
      return this.__components.has(component);
    }

    /**
     * Binds a callback to an internal event.
     * @param {*} event the event name.
     * @param {*} callback A callback function.
     */
    on(event, callback) {
      if (!this.__events.has(event)) {
        this.__events.set(event, new Set());
      }

      this.__events.get(event).add(callback);

      return this;
    }

    /**
     * Un-binds a callback from an internal event.
     * @param {*} event The event name.
     * @param {*} callback A callback function originally bound.
     */
    off(event, callback) {
      if (this.__events.has(event)) {
        this.__events.get(event).delete(callback);
      }

      return this;
    }

    wait(event) {
      let _resolve = null;
      const wait_promise = new Promise((resolve) => {
        _resolve = resolve;
      });
      this.one(event, (...args) => _resolve(this, ...args));
      return wait_promise;
    }

    one(event, callback) {
      const one_handler = (...args) => {
        this.off(event, one_handler);
        callback(...args);
      }
      this.on(event, one_handler);
      return this;
    }

    /**
     * Broadcasts an event to the controller and components
     * @param {*} event The event name
     * @param {...any} args Event parameters
     */
    async broadcast(event, ...args) {

      const event_name = typeof event === "symbol" ? event : `on_${event}`;
      const instances = [this, ...this.components];

      this.broadcast_history.push(event_name);

      for (const component of instances) {
        if (Reflect.has(component, event_name)) {
          const fn = Reflect.get(component, event_name);
          await Promise.resolve(fn.apply(component, args));
          //await Promise.resolve(Reflect.apply(fn, component, args));
        }
      }

      if (this.__events.has(event)) {
        for (const listener of this.__events.get(event).values()) {
          await Promise.resolve(listener(this, ...args));
        }
      }

      if (![EVT_BROADCAST, EVT_CONSTRUCT, EVT_BEFORE_INIT, EVT_INIT, EVT_AFTER_INIT].includes(event)) {
        await this.broadcast(EVT_BROADCAST, event, ...args);
      }
    }
  };
}
