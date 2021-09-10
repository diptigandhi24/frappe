import clsx from "clsx";
import style from "./style.scss";
import { to_str, passthrough } from "../utils";
import { make_react_component } from "../../controllers/web_components";

export const Img = (props) => {
  const {src, fit, backgroundColor, className} = props;
  const style = backgroundColor?{backgroundColor}:{};
  return <img src={src} style={style} className={clsx(className, fit)} />
}

make_react_component({
  tag: "b-awesomebar-item",
  style,
  props: {
    item: passthrough
  },
  component({item}) {
    return <>
      <div class="type">{item && item.type}</div>
      <div class="label">{item && item.label}</div>
      <div class="actions">

      </div>
    </>
  }
});