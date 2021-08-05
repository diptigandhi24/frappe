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

    return <div class="awesome-bar">
      <div class="field">
        <b-icon icon="search" size="12px"></b-icon>
        <input ref={ref} type="text" onChange={onChange}></input>
        <b-icon icon="multi-select" size="12px"></b-icon>
      </div>
      <b-autocomplete target={ref && ref.current}></b-autocomplete>
    </div>
  }
})