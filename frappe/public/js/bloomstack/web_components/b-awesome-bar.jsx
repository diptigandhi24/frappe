import { useEffect, useRef, useCallback, useState } from "react";
import { make_react_component } from "../controllers/web_components";
import style from "./b-awesome-bar.scss";
import { AwesomeBar } from "../controllers/awesome_bar";
import {
  FILTER_MODULE,
  FILTER_DOCTYPE,
  FILTER_REPORT,
  FILTER_NONE
} from "../controllers/awesome_bar/constants"
import { EVT_VALUE_CHANGE, EVT_MODE_CHANGE, EVT_FILTER_MODEL_CHANGE } from "../controllers/awesome_bar/events"
import { FilterToolsComponent } from "../controllers/awesome_bar/components/filter_tools";
import { equals } from "../utils";

make_react_component({
  tag: "b-awesome-bar",
  style,
  component: ({ $web_component }) => {
    const input_ref = useRef();
    const [inner_input_ref, set_inner_input_ref] = useState();
    const auto_complete_ref = useRef();
    const [controller, set_controller] = useState(null);

    // handles storing the b-input inner input element reference so we can
    // manipulate its value while in managed mode.
    const inner_input_ref_handler = useCallback((ref) => {
      if (ref) {
        set_inner_input_ref(ref);
      }
    }, [set_inner_input_ref])

    // Update controller with b-input value
    const value_change_handler = useCallback((e) => {
      if (controller) {
        // update awesome bar with input value
        controller.value = e.target.value;
      }
    }, [controller]);

    const input_keydown_handler = useCallback((e) => {
      const key = e.keyCode || e.charCode;
      // track backspace and remove mode if there is no value on controller
      if ( controller && controller.value == "" && key == 8 ) {
        controller[FilterToolsComponent].set_mode(FILTER_NONE);
      }
    }, [controller]);

    // Detect when the controller itself changes the search value and update our
    // b-input's inner input element.
    const controller_value_change_handler = useCallback((controller, value) => {
      if (controller && inner_input_ref) {
        if (inner_input_ref.value != value) {
          inner_input_ref.value = value;
        }
      }
    }, [controller, inner_input_ref]);

    // Insert controller mode as a tag on the input
    const controller_mode_change_handler = useCallback((controller, mode, label) => {
      if (controller && input_ref) {
        if (mode !== FILTER_NONE) {
          input_ref.current.tags = [{ label }];
        } else {
          input_ref.current.tags = [];
        }
      }
    }, [controller, input_ref]);

    const controller_filter_model_change_handler = useCallback((controller) => {
      if ( auto_complete_ref ) {
        const filter_model = controller.filter_model;
        if ( !equals(auto_complete_ref.current.filter_model, filter_model) ) {
          auto_complete_ref.current.filter_model = filter_model;
        }
      }
    }, [auto_complete_ref])

    // controller evets setup
    useEffect(() => {
      if (controller) {
        controller.on(EVT_VALUE_CHANGE, controller_value_change_handler);
        controller.on(EVT_MODE_CHANGE, controller_mode_change_handler);
        controller.on(EVT_FILTER_MODEL_CHANGE, controller_filter_model_change_handler);
        return () => {
          controller.off(EVT_VALUE_CHANGE, controller_value_change_handler);
          controller.off(EVT_MODE_CHANGE, controller_mode_change_handler);
          controller.off(EVT_FILTER_MODEL_CHANGE, controller_filter_model_change_handler);
        }
      }
    }, [controller, controller_value_change_handler]);

    // hookup input change events manually due to how react hides dom events from web components.
    useEffect(() => {
      if (input_ref) {
        input_ref.current.addEventListener("change", value_change_handler);
        input_ref.current.addEventListener("keydown", input_keydown_handler);
        input_ref.current.on_input_ref = inner_input_ref_handler;
        return () => {
          input_ref.current.removeEventListener("change", value_change_handler);
          input_ref.current.removeEventListener("keydown", input_keydown_handler);
        }
      }
    }, [input_ref, value_change_handler, inner_input_ref_handler]);

    // hook up autocomplete attributes manually.
    // we must set their attributes via a ref and properties due to how react handles attributes and events.
    useEffect(() => {
      if (auto_complete_ref, controller) {
        // pass data source to autocomplete
        auto_complete_ref.current.target = $web_component.element;
        auto_complete_ref.current.data_source = controller.get_data_source();
        // pass filter and sort models to auto complete
        auto_complete_ref.current.filter_model = controller.filter_model;
        auto_complete_ref.current.sort_model = controller.sort_model;
      }
    }, [auto_complete_ref, controller, $web_component])

    // Wait for awesomebar controller to initialize
    useEffect(async () => {
      const abc = new AwesomeBar();
      await abc.init();
      set_controller(abc);
    }, [set_controller]);

    return <b-autocomplete ref={auto_complete_ref}>
      <b-input ref={input_ref} width="large">
        <b-icon slot="left" icon="search" size="16px" padding="0"></b-icon>
        <b-icon slot="right" icon="ellipsis" size="16px" padding="0"></b-icon>
      </b-input>
    </b-autocomplete>
  }
})