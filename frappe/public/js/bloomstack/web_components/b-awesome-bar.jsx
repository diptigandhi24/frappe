import { make_react_component } from "../controllers/web_components";
import { useRef, useCallback, useState } from "react";
import style from "./b-awesome-bar.scss";

make_react_component({
  tag: "b-awesome-bar",
  style,
  component: () => {
    const { input, setInput } = useState("");
    const ref = useRef();
    const onChange = useCallback((e) => {
      setInput(e.current.value);
    }, [setInput])

    return <b-input ref={ref} onChange={onChange} width="large">
      <b-icon slot="left" icon="search" size="16px" padding="0"></b-icon>
      <b-icon slot="right" icon="ellipsis" size="16px" padding="0"></b-icon>
      <b-autocomplete target={ref && ref.current}></b-autocomplete>
    </b-input>
  }
})