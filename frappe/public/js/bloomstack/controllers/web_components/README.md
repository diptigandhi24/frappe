# Web Component Controller

The web component controller is at the heart of our micro frontends approach to encapsulates and wrap common ui libraries into isolated web components.

Web components built this controller have the following features:

- Automatic two way attribute to prop bindings
- Automatic re-renderig on attribute changes
- Attributes may be prefixed with a breakpoint to define values at different states of the ui.
- Encapsulation via `open` or `closed` web components
- Can inject style source data
- Can define external css resources

## Wrapping a react component

The following example illustrates the mimimum setup to wrap a react component:

```jsx
const MyComponent = () => {
  return <div>I am a component</div>
}

make_react_component({
  tag: "my-component",
  component: MyComponent
});
```

Now this component can be used anywhere outside react:

```html
<body>
  <div classs="container">
    <my-component></my-component>
  </div>
</body>
```

Including injecting it via jquery:

```js
$("#some-container").append("<my-component/>");
```

## Attribute features

When a web component is create it can expose a two way binding between an attribute to a prop:

`Component`:
```jsx
const MyComponent = ({ var1 }) => {
  return <div>I am a component: {{ var1 }}</div>
}

make_react_component({
  tag: "my-component",
  component: MyComponent,
  props: {
    var1: to_str
  }
});
```
`Usage`:
```html
<body>
  <div classs="container">
    <my-component var1="some text"></my-component>
  </div>
</body>
```

### Breakpoint prefix

We support the following screen breakpoints following along bootstrap values. Breakpoints triger in a cascading fashion from smallest to largest:

| breakpoint | width |
|:-:|-|
| xs | >= 0px |
| sm | >= 576px |
| md | >= 768px |
| lg | >= 992px |
| xl | >= 1200px |
| xxl | >= 1400px |

To trigger different values depending on breakpoints simply prefix your attributes with brackets and the breakpoint:

```html
<my-component [xs]var1="shown between xs and md" [lg]var1="shown from lg and up"></my-component>
```