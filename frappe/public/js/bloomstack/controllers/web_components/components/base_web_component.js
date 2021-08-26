import { Component } from "../../../component";
import { Compose, ComponentDependencies, withMixins } from "../../../compose";
import { list_breakpoints, find_element_breakpoint } from "../../../web_components/utils";
import { WebComponentInfo } from "../../web_component_info";
import { ParentComponent } from "../../../components/parent";
import { TAG_MOUNTED } from "../../../tags";
import { EVT_MOUNT, EVT_INIT_ELEMENT, EVT_UNMOUNT, EVT_RENDER, EVT_UPDATE, EVT_SET_ATTRIBUTE } from "../events";
import { EVT_CONSTRUCT, EVT_INIT, EVT_AFTER_INIT, EVT_INITIALIZED } from "../../../events";
import { ChildComponent } from "../../../components/child";
import { TAG_WEB_COMPONENT } from "../tags";
import { TaggedComponent } from "../../../components/tagged";
import { with_debounce } from "../../../utils";

export class BaseWebComponentComponent extends ComponentDependencies(ParentComponent) {
  on_define_prop(component, key, conv) {
    component.define_attribute(key, conv);
    Reflect.defineProperty(component, key, {
      get() {
        return component.props.get(key);
      },
      async set(v) {
        component.set_attribute(key, v);
      }
    });

    // pickup values already set on element.
    const current_value = component.element.getAttribute(key);
    const current_transformed_value = typeof conv === "function" ? conv(current_value) : current_value;
    component.props.set(key, current_transformed_value);
  }

  async [EVT_INIT_ELEMENT](component) {
    if (component.config.props) {
      for (const key of Object.keys(component.config.props)) {
        await this.broadcast("define_prop", component, key, Reflect.get(component.config.props, key));
      }
    }
  }

  async on_build_web_component(config, observed_attributes) {
    // cache apis to access inside dynamic element class
    const _controller = this.parent;
    const _broadcast = this.broadcast.bind(this);

    // build attribute breakpoint combinations
    const breakpoint_attributes = [];
    for (const attr of observed_attributes) {
      for (const bp of bloomstack.breakpoints) {
        breakpoint_attributes.push(`[${bp.name}]${attr}`);
      }
    }

    const extended_observed_attributes = [...observed_attributes, ...breakpoint_attributes];
    customElements.define(config.tag, class extends HTMLElement {
      constructor() {
        super();
        this.__web_component = new WebComponentInfo(
          this,
          this.attachShadow({
            mode: config.mode || 'open',
            delegatesFocus: true
          }),
          config
        );

        this.render = with_debounce(this.render, this, config.render_debounce_timeout || 50);
      }

      /**
       * @returns {string[]}
       */
      static get observedAttributes() {
        return extended_observed_attributes;
      }

      /**
       * Element attributes callback. Will only trigger for attributes listed in observerAttributes()
       * @param {string} name Attribute name
       * @param {*} oldValue Old attribute value
       * @param {*} newValue New attribute value
       */
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected && oldValue != newValue) {
          if (this.__web_component[EVT_INITIALIZED]) {
            this.__web_component.set_attribute(name, newValue);
          }
        }
      }

      async update(render) {
        if (!this.isConnected) {
          return;
        }

        await _broadcast(EVT_UPDATE, this.__web_component);
        if (render === undefined || !!render) {
          await this.render();
        }
      }

      async render() {
        if (!this.isConnected || this.__web_component.can_render) {
          return;
        }
        const props = Object.fromEntries(this.__web_component.props);
        Reflect.set(props, "$web_component", this);

        await _broadcast(EVT_RENDER, this.__web_component, props);
        await _broadcast(`${config.type}_render`, this.__web_component, props);
      }

      async disconnectedCallback() {

        if (!this.isConnected) {
          return;
        }

        this.__web_component[TaggedComponent].remove_tag(TAG_MOUNTED);
        _controller.remove_child_component(this.__web_component);

        await _broadcast(EVT_UNMOUNT, this.__web_component,);
        await _broadcast(`${config.type}_unmount`, this.__web_component);

        this.__web_component.initialized = false;
      }

      async connectedCallback() {
        if (!this.isConnected) {
          return;
        }

        await _controller[ParentComponent].add_child_controller(this.__web_component);
        await this.__web_component.with_update(async () => {
          await _broadcast(EVT_INIT_ELEMENT, this.__web_component);

          for (const attr of extended_observed_attributes) {
            if ( this.hasAttribute(attr) ) {
              this.__web_component.set_attribute(attr, this.getAttribute(attr));
            }
          }
          const props = Object.fromEntries(this.__web_component.props);
          const stylesheets_list = (typeof this.__web_component.config.stylesheets === "function") ? this.__web_component.config.stylesheets(props) : this.__web_component.config.stylesheets;
          const scripts_list = (typeof this.__web_component.config.scripts === "function") ? this.__web_component.config.scripts(props) : this.__web_component.config.scripts;
          const links = (stylesheets_list || []).map(href => `<link rel="stylesheet" href="${href}" />`).join("\n");
          const scripts = (scripts_list || []).map(src => `<script type="text/javascript" src="${src}"></script>`).join("\n");
          this.__web_component.shadow.innerHTML = `
            <style>
              :host {
                display: flex;
              }
              :host #__mountpoint {
                flex: 1 1 auto;
                display: flex;
                padding: 0;
                margin: 0;
              }
              ${this.__web_component.config.style ? config.style : ''}
            </style>
            ${links}
            <div id="__mountpoint"></div>
          `;

          this.__web_component.mountpoint = this.__web_component.shadow.getElementById("__mountpoint");
          this.__web_component[ChildComponent].bubble_event(EVT_SET_ATTRIBUTE);
          await this.__web_component[TaggedComponent].add_tag(TAG_WEB_COMPONENT);

          // apply attributes before rendering for the first time.
          for (const att of extended_observed_attributes) {
            await this.__web_component.set_attribute(att, this.getAttribute(att));
          }

          const mountpoint = this.__web_component.mountpoint;
          await this.update(false);
          await _broadcast(EVT_MOUNT, this.__web_component, Object.fromEntries(this.__web_component.props));
          await _broadcast(`${config.type}_mount`, this.__web_component, Object.fromEntries(this.__web_component.props));
          await this.__web_component[TaggedComponent].add_tag(TAG_MOUNTED);
        });
      }
    })
  }
}