import { useRef, useEffect, useState } from "react";
import { make_react_component } from "../controllers/web_components";
import { to_str, to_number, passthrough, prop_to_dom_event_map, to_array } from "./utils";
import { useCallback } from "react";
import { EVT_SET_ATTRIBUTE } from "../controllers/web_components/events";
import style from "./b-input.scss";

make_react_component({
  tag: "b-input",
  style,
  props: {
    default_value: to_str,
    value: to_str,
    label: to_str,
    width: to_str,
    maxLength: to_number,
    tags: to_array,
    on_input_ref: passthrough
  },
  on_prop: {
    value: prop_to_dom_event_map("change")
  },
  component: ({ tags, label, default_value, value, on_input_ref, width, $web_component }) => {
    const [current_value, set_current_value] = useState(default_value);
    const tag_ref = useRef();
    const inner_input_ref = useRef();

    if (default_value && value) {
      console.warn("[b-input] You should not use default_value with value at the same time. Pick managed mode or manual to use this component.");
    }

    const on_key_up = useCallback((e) => {
      // on value change copy value back to web component so its available
      // outside this web component.
      $web_component.set_attribute("value", e.target.value, false);
      const domEvent = new KeyboardEvent("keyup", {
        key: e.key
      });
    }, [$web_component]);

    const on_key_down = useCallback((e) => {
      const domEvent = new KeyboardEvent("keydown", {
        key: e.key
      });
      $web_component.element.dispatchEvent(domEvent);
    }, [$web_component]);

    useEffect(() => {
      if (tag_ref) {
        tag_ref.current.tags = tags;
      }
    }, [tag_ref, tags])

    useEffect(() => {
      if (inner_input_ref && inner_input_ref.current) {
        if (typeof on_input_ref === "function") {
          on_input_ref(inner_input_ref.current);
        }
      }
    }, [inner_input_ref, on_input_ref])

    return <b-field width={width}>
      <slot name="left" slot="left"></slot>
      <slot name="right" slot="right"></slot>
      {label && <label>{label}</label>}
      <b-tagged ref={tag_ref}>
        <input ref={inner_input_ref} value={current_value} onKeyUp={on_key_up} onKeyDown={on_key_down} />
      </b-tagged>
      <slot></slot>
    </b-field>
  }
})