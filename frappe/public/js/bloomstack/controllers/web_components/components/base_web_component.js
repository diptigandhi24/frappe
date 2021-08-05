import { Component } from "../../../component";
import { list_breakpoints, find_element_breakpoint } from "../../../web_components/utils";

export class BaseWebComponentComponent extends Component {
  on_construct() {
    this.shadowStore = new WeakMap();     // used to store shadoe dom per instance
    this.propStore = new WeakMap();       // used to store props per instance
    this.initializedStore = new WeakMap(); // used to track connected callback
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
        if ( typeof conv === "function" ) {
          v = conv(v);
        }
        const currentValue = Reflect.get(targetProps, key);
        if ( v != currentValue ) {
          targetProps.set(key, v);
          Reflect.apply(Reflect.get(element, "render"), element, []);
        }
      }
    });

    // pickup values already set on element.
    const currentValue = element.getAttribute(key);
    const currentTransformedValue = typeof conv === "function"?conv(currentValue):currentValue;
    targetProps.set(key, currentTransformedValue);
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
      }
  
      /**
       * @returns {string[]}
       */
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
        if ( this.isReady &&  oldValue != newValue ) {
          Reflect.set(this, name, newValue);
        }
      }

      async update() {
        if ( !this.isReady ) {
          return;
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
 
        await _broadcast("render", this, config, Object.fromEntries(targetProps), mountpoint);
        await _broadcast(`${config.type}_render`, this, config, Object.fromEntries(targetProps), mountpoint);
      }
  
      async disconnectedCallback() {
        if ( !this.isReady ) {
          return;
        }
  
        this.parentResizeObserver.disconnect();
  
        const mountpoint = shadow.getElementById("__mountpoint");
        await _broadcast("unmount", this, config, mountpoint);
        await _broadcast(`${config.type}_unmount`, this, config, mountpoint);
  
        _initializedStore.set(this, false);
      }
      
      async connectedCallback() {
        if ( this.isReady ) {
          return;
        }

        if ( !_propStore.has(this) ) {
          _propStore.set(this, new Map());
        }

        await _broadcast("init_element", this, config);

        const targetProps = _propStore.get(this);
        const props = Object.fromEntries(targetProps);
        const stylesheets_list = (typeof config.stylesheets === "function")?config.stylesheets(props):config.stylesheets;
        const scripts_list = (typeof config.scripts === "function")?config.scripts(props):config.scripts;

        const links = (stylesheets_list || []).map(href => `<link rel="stylesheet" href="${href}" />`).join("\n");
        const scripts = (scripts_list || []).map(src => `<script type="text/javascript" src="${src}"></script>`).join("\n");
        const shadow = _shadowStore.get(this);
        shadow.innerHTML = `
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
          ${links}
          <div id="__mountpoint"></div>
        `
        for(const att of observedAttributes) {
          Reflect.set(this, att, this.getAttribute(att));
        }
        this.parentResizeObserver = new ResizeObserver(() => this.render()).observe(this.parentNode);
        _initializedStore.set(this, true);

        const mountpoint = shadow.getElementById("__mountpoint");
        await this.update();
        await _broadcast("mount", this, config, Object.fromEntries(targetProps), mountpoint);
        await _broadcast(`${config.type}_mount`, this, config, Object.fromEntries(targetProps), mountpoint);
        await this.render();
      }
    })
  }
}