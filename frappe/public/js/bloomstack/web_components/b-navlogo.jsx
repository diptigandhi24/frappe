import { Img } from "./b-img";
import style from "./b-navlogo.scss";
import { to_str } from "./utils";
import { useState } from "react";
import { useFrappeCall } from "../react/hooks/frappe_hooks";
import { make_react_component } from "../controllers/web_components";

export const NavLogo = ({ label }) => {
  const [appLogoUrl, setAppLogoUrl] = useState("");

  useFrappeCall('frappe.client.get_hooks', { hook: 'app_logo_url' }, (r) => {
    setAppLogoUrl((r.message || []).slice(-1)[0]);
  }, []);

  return <a href="#" aria-label={label}><b-img fit="cover" src={appLogoUrl} /></a>
}

make_react_component({
  tag: "b-navlogo",
  style,
  component: NavLogo,
  props: {
    label: to_str,
    src: to_str,
    fit: to_str
  }
});