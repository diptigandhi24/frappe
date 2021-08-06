import { make_react_component } from "../controllers/web_components";

const WIDTH_SIZES = {small: '4rem', medium: '8rem', large: '16rem'};

make_react_component({
  tag: "b-field",
  style: `
  :host {
    margin: 2px;
    padding: 5px;
    background: white;
    border-radius: 2px;
    min-height: 1rem;
    border: 1px solid #d1d8dd;
    outline: none;
  }

  :host(:focus-within) {
    box-shadow: inset 0 0 2px blue;
  }

  .field {
    display: flex;
    flex-direction: row;
  }

  .field:focus {
    outline: none;
  }

  .field * {
    flex: 1 1 auto;
  }

  .field .left, .field .right {
    flex: 0 0 auto;
  }
  `,
  component: ({width}) => {
    const style = {};
    if ( width && width.strip() in Object.keys(WIDTH_SIZES)) {
      width = Reflect.get(WIDTH_SIZES, width);
    }
    if ( width ) {
      style.width = width;
    }
    return <div class="field" style={style}>
      <slot name="left"></slot>
      <slot></slot>
      <slot name="right"></slot>
    </div>
  }
})