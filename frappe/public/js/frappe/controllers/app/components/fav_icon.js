import { ComponentDependencies } from "../../../compose";
import { BootInfoComponent } from "./boot_info";

/**
 * Injects fav icon into header
 */
export class FavIconComponent extends ComponentDependencies(BootInfoComponent) {
  on_init() {
    let link = $('link[type="image/x-icon"]').remove().attr("href");
		$('<link rel="shortcut icon" href="' + link + '" type="image/x-icon">').appendTo("head");
		$('<link rel="icon" href="' + link + '" type="image/x-icon">').appendTo("head");
  }
}