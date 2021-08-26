import { Component } from "../../../component";
import { find_breakpoint_by_size } from "../../../web_components/utils";
import { BaseWebComponentComponent } from "./base_web_component";
import { ComponentDependencies } from "../../../compose";
import { EVT_CONSTRUCT } from "../../../events";
import { ParentComponent } from "../../../components/parent";
import { TAG_WEB_COMPONENT } from "../tags";
import { TAG_MOUNTED } from "../../../tags";

export class BreakpointBootstrappingComponent extends ComponentDependencies(BaseWebComponentComponent) {
  [EVT_CONSTRUCT]() {
    window.addEventListener("resize", () => {
      for(const component of this.parent[ParentComponent].find_controller_by_tag(TAG_WEB_COMPONENT, TAG_MOUNTED)) {
        component.update_breakpoint();
      }
    });
  }
}