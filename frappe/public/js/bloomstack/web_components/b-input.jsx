import { make_react_component } from "../controllers/web_components";
import { to_str, to_number, passthrough, prop_to_dom_event_map } from "./utils";
import { useCallback } from "react";
import { EVT_SET_ATTRIBUTE } from "../controllers/web_components/events";
import style from "./b-input.scss";

make_react_component({
  tag: "b-input",
  style,
  props: {
    value: to_str,
    label: to_str,
    maxLength: to_number,
    width: to_str,
    value: to_str
  },
  on_prop: {
    value: prop_to_dom_event_map("change")
  },
  component: (props) => {
    if ( isNaN(props["maxLength"]) ) {
      delete props["maxLength"];
    }

    const onChange = useCallback((e) => {
      // on value change copy value back to web component so its available
      // outside this web component.
      props.$web_component.set_attribute("value", e.target.value, false);
    });

    return <b-field width={props.width}>
      <slot name="left" slot="left"></slot>
      <slot name="right" slot="right"></slot>
      {props.label && <label>{props.label}</label>}
      <input {...props} onChange={onChange}/>
      <slot></slot>
    </b-field>
  }
})