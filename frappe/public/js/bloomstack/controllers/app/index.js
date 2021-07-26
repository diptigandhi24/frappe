import { Compose, withMixins } from "../../compose";
import { VueSetupComponent } from "./components/vue_setup";
import { BootInfoComponent } from "./components/boot_info";
import { MetadataCacheComponent } from "./components/metadata_cache";
import { GlobalsComponent } from "./components/globals";
import { PageCachingComponent } from "./components/page_caching";
import { BootGuestsComponent } from "./components/boot_guests";
import { AppLogoComponent } from "./components/app_logo";
import { ToolBarComponent } from "./components/toolbar";
import { FavIconComponent } from "./components/fav_icon";
import { MixpanelIntegrationComponent } from "./components/mixpanel_integration";
import { UserPermissionsComponent } from "./components/user_permissions";
import { FullWidthComponent } from "./components/fullwidth";
import { EnergyPointsComponent } from "./components/energy_points";
import { BootstrapKeyboardComponent } from "./components/bootstrap_keyboard";
import { RTLSupportComponent } from "./components/rtl_support";
import { LastRouteComponent } from "./components/last_route";
import { PageContainerComponent } from "./components/page_container";
import { BootMessagesComponent } from "./components/boot_messages";
import { ChangeLogComponent } from "./components/change_log";
import { SetupDialogComponent } from "./components/setup_dialog";
import { CSRFComponent } from "./components/csrf";
import { VersionUpdateComponent } from "./components/version_update";
import { SocialComponent } from "./components/social";
import { BuildFeedbackComponent } from "./components/build_feedback";
import { EmailComponent } from "./components/email";
import { DeveloperUtilsComponent } from "./components/developer_utils";
import { ModulesComponent } from "../common/components/modules";
import { LinkPreviewComponent } from "./components/link_preview";
import { SessionComponent } from "./components/session";
import { ActionsComponent } from "../common/components/actions";
import { BreadcrumbsComponent } from "../common/components/breadcrumbs";
import "../page";

frappe.provide('frappe.app');
frappe.provide('frappe.desk');

/**
 * Application controller for desk
 */
export class Application extends Compose(
  BootInfoComponent,
  BootGuestsComponent,
  VueSetupComponent,
  MetadataCacheComponent,
  GlobalsComponent,
  PageCachingComponent,
  UserPermissionsComponent,
  AppLogoComponent,
  ToolBarComponent,
  FavIconComponent,
  MixpanelIntegrationComponent,
  FullWidthComponent,
  EnergyPointsComponent,
  BootstrapKeyboardComponent,
  RTLSupportComponent,
  LastRouteComponent,
  PageContainerComponent,
  BootMessagesComponent,
  ChangeLogComponent,
  SetupDialogComponent,
  CSRFComponent,
  VersionUpdateComponent,
  SocialComponent,
  BuildFeedbackComponent,
  DeveloperUtilsComponent,
  ModulesComponent,
  LinkPreviewComponent,
  withMixins(SessionComponent,
    "handle_session_expired",
    "redirect_to_login",
    "logout"
  ),
  withMixins(ActionsComponent,
    "trigger_primary_action"
  ),
  BreadcrumbsComponent
) {

  async on_after_init() {
    // route to home page
    frappe.route();

    // trigger app startup
    $(document).trigger("startup");
    $(document).trigger("app_ready");
    await this.broadcast("startup");

    frappe.tags.utils.fetch_tags();

    // Map existing api
    frappe.get_module = (...args) => this[ModulesComponent].get_module(...args);
  }

}