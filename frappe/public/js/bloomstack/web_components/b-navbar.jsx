import clsx from 'clsx';
import style from "./b-navbar.scss";
import { to_str, parse_json } from "./utils";
import { useState } from "react";
import { make_react_component } from '../controllers/web_components';

export const NavBar = (props) => {
  const {direction, children, size, theme} = props;
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
}

make_react_component({
  tag: "b-navbar",
  stylesheets: ["/assets/frappe/css/octicons/octicons.css"],
  style,
  component: NavBar,
  props: {
    direction: to_str,
    size: to_str,
    theme: to_str
  }
});