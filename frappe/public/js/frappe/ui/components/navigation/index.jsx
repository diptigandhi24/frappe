import { withReactWebComponent } from "../../react_web_component"
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import style from "./styles.scss";

const NavIcon = ({className, href, backgroundColor, icon, children}) => {
  const backgroundImage = icon?`url(${icon})`: undefined;
  const anchorStyle = { backgroundImage, backgroundColor };

  return <li className={clsx("icon", className)}>
    <a style={anchorStyle} href={href}>{children}</a>
  </li>
}

const Navigation = () => {
  const [appLogoUrl, setAppLogoUrl] = useState("");

  useEffect(async () => {
    try {
      const r = await frappe.call('frappe.client.get_hooks', { hook: 'app_logo_url' });
      setAppLogoUrl((r.message || []).slice(-1)[0]);
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  return <ul className="navigation">
    <NavIcon href="#" className="logo" icon={appLogoUrl}></NavIcon>
    <NavIcon href="#"><i className="octicon octicon-package"></i></NavIcon>
    <NavIcon href="#"><i className="octicon octicon-globe"></i></NavIcon>
    <NavIcon href="#"><i className="octicon octicon-bookmark"></i></NavIcon>
    <li className="spacer"></li>
    <NavIcon href="#" className="bottom"><i className="octicon octicon-gear"></i></NavIcon>
    <NavIcon href="#" className="bottom"><i className="octicon octicon-question"></i></NavIcon>
  </ul>
}

withReactWebComponent({
  tag: "b-navigation",
  stylesheets: ["/assets/frappe/css/octicons/octicons.css"],
  style,
  component: Navigation
});