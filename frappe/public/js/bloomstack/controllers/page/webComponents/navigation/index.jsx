import { withReactWebComponent } from "../../../frappe/ui/react_web_component"
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import style from "./styles.scss";
import { useFrappeCall } from "../../react/hooks/useFrappeCall";

const NavIcon = ({className, iconRenderer, href, backgroundImage, backgroundColor, icon, children}) => {
  const _backgroundImage = backgroundImage?{ backgroundImage: `url(${backgroundImage})`}: {};
  const anchorStyle = { ..._backgroundImage, backgroundColor };

  return <li className={clsx("icon", className)}>
    <a style={anchorStyle} href={href}>{iconRenderer?iconRenderer():''}</a>
  </li>
}

const Octicon = ({icon}) => <i className={`octicon octicon-${icon}`}></i>

const Navigation = () => {
  const [appLogoUrl, setAppLogoUrl] = useState("");

  useFrappeCall('frappe.client.get_hooks', { hook: 'app_logo_url' }, (r) => {
    setAppLogoUrl((r.message || []).slice(-1)[0]);
  }, []);
  
  return <ul className="navigation">
    <NavIcon href="#" className="logo" backgroundImage={appLogoUrl}></NavIcon>
    <NavIcon href="#" iconRenderer={() => <Octicon icon="package"/>}></NavIcon>
    <NavIcon href="#" iconRenderer={() => <Octicon icon="globe"/>}></NavIcon>
    <NavIcon href="#" iconRenderer={() => <Octicon icon="bookmark"/>}></NavIcon>
    <li className="spacer"></li>
    <NavIcon href="#" iconRenderer={() => <Octicon icon="gear"/>} className="bottom"></NavIcon>
    <NavIcon href="#" iconRenderer={() => <Octicon icon="question"/>} className="bottom"></NavIcon>
  </ul>
}

withReactWebComponent({
  tag: "b-navigation",
  stylesheets: ["/assets/frappe/css/octicons/octicons.css"],
  style,
  component: Navigation
});