import { make_js_component } from "../controllers/web_components";
import { to_str } from "./utils";

make_js_component({
  tag: "b-grapejs",
  props: {
    width: to_str,
    height: to_str
  },
  stylesheets: ["//unpkg.com/grapesjs/dist/css/grapes.min.css"],
  scripts: ["//unpkg.com/grapesjs"],
  component: ({ width = 'auto', height = '300px' }, mountpoint) => {
    mountpoint.innerHtml = `
      <div id="gjs">
        <h1>Hello World Component!</h1>
      </div>
      <div id="blocks"></div>
    `;

    const editor = grapejs.init({
      container: '#gjs',
      width: width,
      height: height,
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section', // id is mandatory
            label: '<b>Section</b>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-section' },
            content: `<section>
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
          }, {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          }, {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
            activate: true,
          }
        ]
      }
    })

  }
})