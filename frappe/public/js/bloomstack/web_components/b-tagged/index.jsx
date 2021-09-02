import { Tag } from "./tag";
import { make_react_component } from "../../controllers/web_components";
import style from "./style.scss";
import { to_array } from "../utils";

make_react_component({
  tag: "b-tagged",
  style,
  props: {
    tags: to_array
  },
  component: ({ tags }) => {
    return <>
      { tags && tags.map((t, i) => <Tag key={i} {...t} />)}
      <slot></slot>
    </>
  }
});