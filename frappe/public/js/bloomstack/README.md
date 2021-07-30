# Bloomstack Framework Cleanup and Refactoring

This document exists to document our new effort to cleanup and refactor frappe's older codebase into a modular and loosely coupled design.

To that end the ```bloomstack``` namespace will encapsulate all new APIs that expose our componetization shift on the codebase. In this folder hierchy you will find the following structure:

```
bloomstack/
├─ controllers/
│  ├─ <controller name>/
│  │  ├─ components/
├─ web_components/
├─ react/
├─ component.js
├─ compose.js
├─ README.md
```

## Controllers
```
bloomstack/
├─ controllers/
│  ├─ <controller name>/
│  │  ├─ components/
```

Controllers are a collection of components that loosely extend the controller to add encapsulated features.

Inside each controller we isolate specific features into a component class which can trigger events for its parent controller or sibling components.

```Note: Components are not meant to have any deeper nested components. All extensions are and feature additions are done to the controller as other components.```

## Class composition library location
```
├─ component.js
├─ compose.js
```

These two files are at the heart of the frontend refactoring.

Both expose Component class and Compose function respectively which help you encapsulate features and build controllers.

## Web Components
```
├─ web_components/
```

## React utilities
```
├─ react/
```

Dedicated react utilities for building react based web components

# Composition pattern

To build a controller with encapsulated features we use the class composition pattern peppered with with an event system to ease communications between controller and components.

Below is an example of how a controler can be built:

`my_controller.js`:
```js
class MyController extends Compose([
  Feature1Component,
  Feature2Component
]) {}
```

`feature_1_component.js`:
```js
class Feature1Component extends Component {
  async on_construct() {
    // setup feature before anything initializes
  }
}
```

`feature_2_component.js`:
```js
class Feature2Component extends Component {
  async on_construct() {
    // setup feature before anything initializes
  }
}
```

Internally Compose will generate a dynamic class injecting the components as properties to controller. This means you can access each component from the controller my symply using its class as an accessor:

`my-controller.js`:
```js
class MyController extends Compose([
  Feature1Component,
  Feature2Component
]) {
  async on_init() {
    // simply use the the class as the accessor
    this[Feature1Component].method_in_feature_1()
  }
}
```

Tho this is available to the controller, it is highly discouraged calling components directly unless it is for something very specific. 

Instead you should be sending events to allow the more composition options and unforseen extensions you might add later. For that we have events.

## Events

In the example above notice the `on_construct` and `on_init` methods?

These are lazy event listeners. by convention any method starting with `on_` is considered an event listener and can potentially be triggered by the controller itself or a component.

To send an event to all parties involved there is the ```broadcast``` method available to both the controller and components:

`my-controller.js`:
```js
class MyController extends Compose([
  Feature1Component,
  Feature2Component
]) {

  async on_init() {
    const arg1 = "arg1";
    const arg2 = "arg2";
    this.broadcast("i_am_ready", arg1, arg2);
  }
}
```

Then one, both or neither of the controllers in the sample can subscribe to the event:


`feature_2_component.js`:
```js
class Feature2Component extends Component {
  async on_i_am_ready(arg1, arg2) {
    console.log(arg1, arg2);
  }
}
```

### External event subscriptions
For code running outside of the controller you may also subscribe to the event system with the `on` and `off` methods:

```js
const my_component = new MyComponent();

const do_something_interesting = (component, arg1, arg2) => {
  // do something interesting...
});

// subscribe
my_component.on("i_am_ready", do_something_interesting);

// initialize the component.
my_component.init();

// unsubscribe
my_component.off("i_am_ready", do_something_interesting);

```

## Method Mixins
Extending a controller vis components does not automatically make component methods part of the controller.

To ease exposing specific methods from components we have mixins:

```js
class MyController extends Compose([
  withMixins(Feature1Component,
    "component_mehod1",
    "component_mehod2",
  ),
  Feature2Component
]) { }

const my_component = new MyComponent();

my_component.component_method1();
my_component.component_method2();
```