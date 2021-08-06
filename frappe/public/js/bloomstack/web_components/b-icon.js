import { make_js_component } from "../controllers/web_components";
import { to_str } from "./utils";
import clsx from "clsx";
import style from "./b-icon.scss";

make_js_component({
  tag: "b-icon",
  style,
  stylesheets: [
    "/assets/frappe/css/octicons/octicons.css",
  ],
  props: {
    icon: to_str,
    lib: to_str,
    size: to_str,
    padding: to_str
  },
  component: ({ icon, lib, size, padding }, mountpoint) => {
    const library = lib ? lib : "octicon";
    const pxsize = size || '1rem';
    mountpoint.style = `min-width: ${pxsize}; min-height: ${pxsize};`;
    const style = {};
    if (padding) {
      style["--v-padding"] = padding;
    }
    if (size) {
      style["--v-size"] = size;
    }
    const strStyle = Object.entries(style).reduce((p, c) => {
      if (c && c[0] && c[1]) {
        p.push(`${c[0]}: ${c[1]};`);
      }
      return p;
    }, []).join('');
    mountpoint.innerHTML = `<i style="${strStyle}" class="${clsx(library, `${library}-${icon}`)}"></i>`
  }
})