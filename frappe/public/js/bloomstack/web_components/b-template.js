import { make_js_component } from "../controllers/web_components";
import { to_str } from "./utils";

make_js_component({
  tag: "b-template",
  props: {
    template: to_str
  },
  render_debounce_timeout: 1,
  component: ({template}, mountpoint) => {
    mountpoint.innerHTML = template;
  }
})