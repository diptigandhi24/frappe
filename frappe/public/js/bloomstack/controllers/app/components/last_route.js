import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Reloads last route stored in local storage.
 */
export class LastRouteComponent extends ComponentDependencies(BootInfoComponent) {
  on_boot() {
    if (localStorage.getItem("session_last_route")) {
      window.location.hash = localStorage.getItem("session_last_route");
      localStorage.removeItem("session_last_route");
    }
  }
}