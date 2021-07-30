import { Component } from "../../../component";
import { list_breakpoints, find_element_breakpoint } from "../../../web_components/utils";

export class ReactWebComponentComponent extends Component {
  on_construct() {
    this.shadowStore = new WeakMap();     // used to store shadoe dom per instance
    this.propStore = new WeakMap();       // used to store props per instance
    this.initializedStore = new WeakMap(); // used to track connected callback
  }

  on_react_render(element, config, props, mountpoint) {
    this.broadcast("on_render", element, config, props, mountpoint);
    const Renderer = config.component;
    ReactDOM.render(<Renderer {...props} />, mountpoint);
    return true;
  }

  on_react_mount(element, config, props, mountpoint) {
    this.broadcast("on_mount", element, config, props, mountpoint);
  }

  on_react_unmount(element, config, mountpoint) {
    this.broadcast("on_unmount", element, config, mountpoint);
    ReactDOM.unmountComponentAtNode(mountpoint);
    return true;
  }

  on_define_prop(element, key, conv) {
    const _propStore = this.propStore;

    if ( !_propStore.has(element) ) {
      _propStore.set(element, new Map());
    }
    const targetProps = _propStore.get(element);
 
    Reflect.defineProperty(element, key, {
      get() {
        return Reflect.get(targetProps, key);
      },
      set(v) {
        const currentValue = Reflect.get(targetProps, key);
        if ( v != currentValue ) {
          targetProps.set(key, v);
          Reflect.apply(Reflect.get(element, "render"), element, []);
        }
      }
    });
  }

  async on_init_element(element, config) {
    if ( config.props ) {
      for(const key of Object.keys(config.props)) {
        await this.broadcast("define_prop", element, key, Reflect.get(config.props, key));
      }
    }
  }

  async on_build_web_component(config, observedAttributes) {
    // cache apis to access inside dynamic element class
    const _broadcast = this.broadcast.bind(this);
    const _shadowStore = this.shadowStore;
    const _propStore = this.propStore;
    const _initializedStore = this.initializedStore;
    
    customElements.define(config.tag, class extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: config.mode || 'open' });
        _shadowStore.set(this, shadow);
        _broadcast("init_element", this, config);
      }
  
      static get observedAttributes() {
        return observedAttributes;
      }

      get isReady() {
        const initialized = _initializedStore.get(this) || false;
        // Avoid rendering when we are not connected to the dom
        if ( !this.isConnected || !initialized ) {
          return false;
        }

        return true;
       }
  
      attributeChangedCallback(name, oldValue, newValue) {
        if ( oldValue != newValue ) {
          Reflect.set(this, name, newValue);
        }
      }

      async update() {
        if ( !this.isReady ) {
          return;
        }
  
        if ( !_propStore.has(this) ) {
          _propStore.set(this, new Map());
        }
        const targetProps = _propStore.get(this);
  

        await _broadcast("update", this, config, targetProps);
      }
  
      async render() {
        const targetProps = _propStore.get(this);
        const shadow = _shadowStore.get(this);
        const mountpoint = shadow.getElementById("__mountpoint");
        if ( !this.isReady ) {
          return;
        }
 
        await _broadcast("react_render", this, config, Object.fromEntries(targetProps), mountpoint);
      }
  
      async disconnectedCallback() {
        if ( !this.isReady ) {
          return;
        }
  
        this.parentResizeObserver.disconnect();
  
        const mountpoint = shadow.getElementById("__mountpoint");
        await _broadcast("react_unmount", this, config, mountpoint);
  
        _initializedStore.set(this, false);
      }
      
      async connectedCallback() {
        if ( this.isReady ) {
          return;
        }

        const links = (config.stylesheets || []).map(l => `<link rel="stylesheet" href="${l}" />`).join("\n");
        const shadow = _shadowStore.get(this);
        shadow.innerHTML = `
          ${links}
          <style>
            :host {
              display: flex;
            }
            #__mountpoint {
              flex: 1 1 auto;
              display: flex;
              padding: 0;
              margin: 0;
            }
            ${config.style?config.style:''}
          </style>
          <div id="__mountpoint"></div>
        `
        for(const att of observedAttributes) {
          Reflect.set(this, att, this.getAttribute(att));
        }
        this.parentResizeObserver = new ResizeObserver(() => this.render()).observe(this.parentNode);
        _initializedStore.set(this, true);

        const targetProps = _propStore.get(this);
        const mountpoint = shadow.getElementById("__mountpoint");
        await this.update();
        await _broadcast("react_mount", this, config, Object.fromEntries(targetProps), mountpoint);
        await this.render();
      }
    })
  }

  /**
   * Seamlessly bootstraps a web component.
   * @param {object}    config Component configuration.
   * @param {string}    config.tag The HTML Element tag name.
   * @param {array}     config.stylesheets An array of stylesheet urls to include.
   * @param {string}    config.style A string of raw css to inject into the root.
   * @param {object}    config.props An object containing component props and a function to sanitize and convert its values.
   * @param {function}  config.component A component implementation function to render
   * @param {string}    config.mode Set to "closed" to build a private shadow dom. Defaults to open.
   */
  async make_react_component(config) {
    const _broadcast = this.broadcast.bind(this);
    const _shadowStore = this.shadowStore;
    const _propStore = this.propStore;
    const _initializedStore = this.initializedStore;
    const _observedAttributes = [
      ...Object.keys(config.props || {})
    ];
    await this.broadcast("build_observed_attributes", config, _observedAttributes);
    await this.broadcast("build_web_component", config, _observedAttributes)
  }
}