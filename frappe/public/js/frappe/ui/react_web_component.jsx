
/**
 * Seamlessly bootstraps a react component inside a web component.
 * @param {object}  config Component configuration.
 * @param {string}  config.tag The HTML Element tag name.
 * @param {array}   config.stylesheets An array of stylesheet urls to include.
 * @param {string}  config.style A string of raw css to inject into the root.
 */
export function withReactWebComponent(config) {
  const Wrapper = class extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });
      const links = (config.stylesheets || []).map(l => `<link rel="stylesheet" href="${l}" />`).join("\n");
      const Renderer = config.component;
      shadow.innerHTML = `
        ${links}
        <style>
          #__mountpoint {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }
          ${config.style?config.style:''}
        </style>
        <div id="__mountpoint"></div>
      `
      const mountpoint = shadow.getElementById("__mountpoint");
      const name = this.getAttribute('name');
      ReactDOM.render(<Renderer />, mountpoint);
    }
  }

  customElements.define(config.tag, Wrapper);

  return Wrapper;
}