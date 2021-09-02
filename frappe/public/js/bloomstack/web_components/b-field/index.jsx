import { make_react_component } from "../../controllers/web_components";
import style from "./style.scss";
import { to_str } from "../utils";

const WIDTH_SIZES = { small: '4rem', medium: '16rem', large: '32rem' };

make_react_component({
  tag: "b-field",
  style,
  props: {
    width: to_str
  },
  component: ({ width }) => {
    const style = {};
    if (width && Object.keys(WIDTH_SIZES).includes(width.trim())) {
      width = Reflect.get(WIDTH_SIZES, width.trim());
    }

    if (width) {
      style.width = width;
    }

    return <div class="field" style={style}>
      <slot name="left"></slot>
      <slot></slot>
      <slot name="right"></slot>
    </div>
  }
})