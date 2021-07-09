export function ReactWebComponent(tag, renderer) {
  const Wrapper = class extends HTMLElement {
    connectedCallback() {
      const mountPoint = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

      const name = this.getAttribute('name');
      ReactDOM.render(renderer(), mountPoint);
    }
  }

  customElements.define(tag, Wrapper);

  return Wrapper;
}