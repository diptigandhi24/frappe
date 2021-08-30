import { make_react_component } from "../controllers/web_components";
import { useRef, useCallback, useState } from "react";
import style from "./b-awesome-bar.scss";
import { useEffect } from "react";
import { AwesomeBar } from "../controllers/awesome_bar";

const awesome_bar_controller = new AwesomeBar();

make_react_component({
  tag: "b-awesome-bar",
  style,
  component: (props) => {
    const inputRef = useRef();
    const autoCompleteRef = useRef();

    const onChange = useCallback((e) => {
      awesome_bar_controller.value = e.target.value;
    }, [setInput]);

    // hook up autocomplete and input web components.
    // we must set their attributes via a ref and properties due to how react handles attributes and events.
    useEffect(() => {
      inputRef.current.addEventListener("change", onChange);
      autoCompleteRef.current.target = inputRef.current;
      autoCompleteRef.current.data_source = awesome_bar_controller.get_data_source();
      autoCompleteRef.current.filter_model = awesome_bar_controller.filter_model;
      autoCompleteRef.current.sort_model = awesome_bar_controller.sort_model;
    }, [inputRef, autoCompleteRef, onChange]);

    useEffect(async () => {
      await awesome_bar_controller.init();
    }, []);

    return <b-input ref={inputRef} width="large">
      <b-icon slot="left" icon="search" size="16px" padding="0"></b-icon>
      <b-icon slot="right" icon="ellipsis" size="16px" padding="0"></b-icon>
      <b-autocomplete ref={autoCompleteRef}></b-autocomplete>
    </b-input>
  }
})