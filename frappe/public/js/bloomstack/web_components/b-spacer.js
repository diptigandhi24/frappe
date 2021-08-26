import { make_js_component } from "../controllers/web_components";

make_js_component({
  tag: "b-spacer",
  style: `
  :host {
    flex: 1 1 auto;
  }
  `,
  component: (props) => {
    // nothing to render, just a spacer
  }
})