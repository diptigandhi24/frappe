import { make_react_component } from "../controllers/web_components";
import { to_str, to_number } from "./utils";

make_react_component({
  tag: "b-input",
  style: `
    input {
      background: transparent;
      border: none;
      flex: 1 1 auto;
      display: inline-block;
    }
    input:focus {
      border: none;
      outline: none;
    }
  `,
  props: {
    onchange: (x) => x,
    onChange: (x) => x,
    value: to_str,
    label: to_str,
    "max-length": to_number,
    width: to_str
  },
  component: (props) => {
    console.log("--- INPUT TAG:");
    console.log(props);
    if ( isNaN(props["max-length"]) ) {
      delete props["max-length"];
    }

    return <b-field width={props.width}>
      <slot name="left" slot="left"></slot>
      <slot name="right" slot="right"></slot>
      {props.label && <label>{props.label}</label>}
      <input {...props} />
      <slot></slot>
    </b-field>
  }
})