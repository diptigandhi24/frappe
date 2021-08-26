import clsx from "clsx";
import style from "./b-img.scss";
import { to_str } from "./utils";
import { make_react_component } from "../controllers/web_components";

export const Img = (props) => {
  const {src, fit, backgroundColor, className} = props;
  const style = backgroundColor?{backgroundColor}:{};
  return <img src={src} style={style} className={clsx(className, fit)} />
}

make_react_component({
  tag: "b-img",
  style,
  component: Img,
  props: {
    src: to_str,
    fit: to_str
  }
});