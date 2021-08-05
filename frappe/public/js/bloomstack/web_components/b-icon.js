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
    size: to_str
  },
  component: ({icon, lib, size}, mountpoint) => {
    const library = lib?lib:"octicon";
    const pxsize = size || '1rem';
    mountpoint.style=`min-width: ${pxsize}; min-height: ${pxsize};`;
    mountpoint.innerHTML = `<i style="--v-size: ${pxsize}" class="${clsx(library, `${library}-${icon}`)}"></i>`
  }
})