import { withReactWebComponent } from "../../react/with_react_web_component"
import clsx from "clsx";
import style from "./styles.scss";
import { toStr } from "../utils";

export const Img = ({src, fit, backgroundColor, className}) => {
  const style = backgroundColor?{backgroundColor}:{};
  return <img src={src} style={style} className={clsx(className, fit)} />
}

withReactWebComponent({
  tag: "b-img",
  style,
  component: Img,
  props: {
    src: toStr,
    fit: toStr
  }
});