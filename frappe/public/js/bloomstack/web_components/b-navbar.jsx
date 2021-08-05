import clsx from 'clsx';
import style from "./b-navbar.scss";
import { to_str, parse_json, to_bool } from "./utils";
import { useState } from "react";
import { make_react_component } from "../controllers/web_components";

make_react_component({
  tag: "b-navbar",
  stylesheets: ({ theme }) => [
    "/assets/frappe/css/octicons/octicons.css",
    `/assets/css/theme-${theme || 'light'}.min.css`
  ],
  style,
  props: {
    direction: to_str,
    size: to_str,
    theme: to_str,
    visible: to_bool
  },
  component: (props) => {
    const {direction, children, size, theme, visible, element} = props;
    const [appLogoUrl, setAppLogoUrl] = useState("");
    const style = {
      flexDirection: direction
    }
  
    if ( direction && direction.indexOf("column") > -1 && size ) {
      Object.assign(style, {
        width: size,
        height: "100%"
      })
    } else if ( direction && direction.indexOf("row") > -1 && size ) {
      Object.assign(style, {
        width: "100%",
        height: size
      })
    }
  
    return <div className={clsx("navigation")} style={style}>
      <slot>{children}</slot>
    </div>
  },
});