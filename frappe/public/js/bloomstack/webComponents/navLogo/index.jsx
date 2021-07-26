import { withReactWebComponent } from "../../react/with_react_web_component"
import { Img } from "../img";
import style from "./styles.scss";
import { toStr } from "../utils";
import { useState } from "react";
import { useFrappeCall } from "../../react/hooks/use_frappe_call";

export const NavLogo = ({}) => {
  const [appLogoUrl, setAppLogoUrl] = useState("");

  useFrappeCall('frappe.client.get_hooks', { hook: 'app_logo_url' }, (r) => {
    setAppLogoUrl((r.message || []).slice(-1)[0]);
  }, []);

  return <a href="#"><b-img fit="cover" src={appLogoUrl} /></a>
}

withReactWebComponent({
  tag: "b-navlogo",
  style,
  component: NavLogo,
  props: {
    src: toStr,
    fit: toStr
  }
});