
/**
 * Seamlessly bootstraps a react component inside a web component.
 * @param {object}  config Component configuration.
 * @param {string}  config.tag The HTML Element tag name.
 * @param {array}   config.stylesheets An array of stylesheet urls to include.
 * @param {string}  config.style A string of raw css to inject into the root.
 * @param {object}  config.props An object containing component props and a function to sanitize and convert its values.
 */
export function withReactWebComponent(config) {
  const _shadows = new WeakMap();     // used to store shadoe dom per instance
  const _props = new WeakMap();       // used to store props per instance
  const _initialized = new WeakMap(); // used to track connected callback

  const defineProp = (target, key, conv) => {
    if ( !_props.has(target) ) {
      _props.set(target, new Map());
    }
    const targetProps = _props.get(target);
 
    Reflect.defineProperty(target, key, {
      get() {
        return Reflect.get(targetProps, key);
      },
      set(v) {
        const currentValue = Reflect.get(targetProps, key);
        if ( v != currentValue ) {
          targetProps.set(key, v);
          Reflect.apply(Reflect.get(target, "render"), target, []);
        }
      }
    })
  }
  const Wrapper = class extends HTMLElement {
    constructor() {
      super();
      if ( config.props ) {
        for(const key of Object.keys(config.props)) {
          defineProp(this, key, Reflect.get(config.props, key));
        }
      }

      const shadow = this.attachShadow({ mode: 'open' });
      _shadows.set(this, shadow);
    }

    static get observedAttributes() {
      return Object.keys(config.props || {});
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if ( oldValue != newValue ) {
        Reflect.set(this, name, newValue);
      }
    }

    render() {
      const initialized = _initialized.get(this) || false;
      // Avoid rendering when we are not connected to the dom
      if ( !this.isConnected || !initialized ) {
        return;
      }

      if ( !_props.has(this) ) {
        _props.set(this, new Map());
      }
      
      const targetProps = _props.get(this);
      const shadow = _shadows.get(this);
      console.log(config.tag, shadow);
      const mountpoint = shadow.getElementById("__mountpoint");
      const Renderer = config.component;
      ReactDOM.render(<Renderer {...Object.fromEntries(targetProps)} />, mountpoint);
    }

    disconnectedCallback() {
      const initialized = _initialized.get(this) || false;
      if ( !initialized ) {
        return;
      }

      const mountpoint = shadow.getElementById("__mountpoint");
      ReactDOM.unmountComponentAtNode(mountpoint);

      _initialized.set(this, false);
    }
    
    connectedCallback() {
      console.log(config.tag, "CONNECTED", this);
      const links = (config.stylesheets || []).map(l => `<link rel="stylesheet" href="${l}" />`).join("\n");
      const shadow = _shadows.get(this);
      shadow.innerHTML = `
        ${links}
        <style>
          :host {
            display: flex;
          }
          #__mountpoint {
            flex: 1 1 auto;
            display: inline-block;
            padding: 0;
            margin: 0;
          }
          ${config.style?config.style:''}
        </style>
        <div id="__mountpoint"></div>
      `
      _initialized.set(this, true);
      this.render();
    }
  }

  customElements.define(config.tag, Wrapper);

  return Wrapper;
}