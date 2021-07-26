import { withReactWebComponent } from "../../react/with_react_web_component"
import clsx from 'clsx';
import style from "./styles.scss";
import { toStr, fromJSON } from "../utils";
import { useState } from "react";

export const NavBar = (props) => {
  console.log("NAVBAR PROPS: ", props);
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

withReactWebComponent({
  tag: "b-navbar",
  stylesheets: ["/assets/frappe/css/octicons/octicons.css"],
  style,
  component: NavBar,
  props: {
    direction: toStr,
    size: toStr,
    theme: toStr,
    ":direction": fromJSON,
    ":size": fromJSON,
    ":direction[sm]": toStr,
    "direction[md]": toStr,
    ":direction!sm"
  }
});