# Exp framework

[Introduction](#introduction)

[Installation](#installation)

[Example](#example)

[Documentation](#documentation)

    * [JavaScript Exp constructor](#javascript-exp-constructor)

    * [HTML Exp attributes](#html-exp-attributes)

[Guides](#guides)

    * [Initialisation](#initialisation)

    * [Model and data binding](#model-and-data-binding)

    * [Methods](#methods)

    * [Iterations](#iterations)

    * [Conditionals](#conditionals)

    * [HTML element attributes](#html-element-attributes)

    * [Listeners to DOM events](#listeners-to-dom-events)

    * [Triggers](#triggers)

        * [onready trigger](#onready-trigger)

        * [onexit trigger](#onexit-trigger)

        * [onaction trigger](#onaction-trigger)

    * [Recommendations](#recommendations)
    
    * [Event tracking](#event-tracking)


## Introduction
Exp framework is a lightweigth minimalistic JavaScript framework designed specifically for building banners in Exponea platform. Many of architectural designs reflect this aim.

One of the main motivations is to code in a declarative manner rather than procedural. Exp framework can be thought of as an engine which performs many unneccessary routines on behalf of you.

Neccesarrily to mention, we have been greatly influenced by already existing frameworks such as VueJS or AngularJS.


## Installation
1. Clone repository
2. Install dependencies `npm install`
3. Run development server `npm run start`
4. Build `npm run webpack`

Note that running `npm run start` will open up server on `localhost:1234`, where you have interactive Exp tutorials and further explanations.


## Example
The following example illustrates the power of Exp, specifically iterating over an array using `exp-for`.

```html
<div id="root">
    <button exp-click="addNumber">Add number!</button>
    <div exp-for="number in numbers">
        <p exp-bind="number"></p>
    </div>
</div>
<script>
var banner = new Exp({
    el: "#root",
    data: {
        counter: 1,
        numbers: []
    },
    methods: {
        addNumber: function() {
            this.numbers.push(this.counter++);
        }
    }
})
</script>
```


## Documentation


### JavaScript Exp constructor
The framework is initialized through the Exp object, which you have to instantiate with proper dictionary argument, describing the setting.
```javascript
var banner = new Exp(settings)
```
The `settings` object has the following available attributes

| Key               | Value       | Description | Example     |
| ----------------- | ----------- | ----------- | ----------- |
| `context`         | Dictionary  | The Exponea weblayer context data that are passed from Exponea JS SDK. | `{ banner_id: "123" }` or `this` when working in Exponea weblayer editor |
| `el`              | String      | Selector which points to an element on which Exp will be initialised. Either `el` or `html` should be used. | `".exp-banner"` |
| `insert`          | String      | Selector which points to an element that the `html` code will be inserted into as a child. Default `document.body`. | `".banner-window"` |
| `data`            | Dictionary  | Data initially populating the model. | `{ sizes: ['large', 'small'], logged_in: false }` |
| `methods`         | Dictionary  | Definition of the user functions, that can be used in JS or triggered by HTML objects. | `{ onClick: () => alert("Hello, World!) }` |
| `html`            | String      | A custom HTML code of the weblayer.  Either `el` or `html` should be used. | `"<div class="test">aaa</div>"` |
| `style`           | String      | A custom CSS code of the weblayer. | `.test{color: blue;}` |
| `scoped`          | Boolean     | Adding a generated hash to weblayers CSS rules, causing the CSS to affect only the weblayer. Default `false`. | `true` |
| `tracking`        | Boolean     | Default tracking of event `banner` when weblayer is showed. Default `true`. | `false` |
| `control_group`   | Boolean     | Weblayer will not be shown, but tracking will run as for a custom control group. Default `false`. | `false` |
| `mounted`         | Function    | A function that is called when the weblayer is loaded. | `function() { setTimeout(function() { this.ref.header.style.display = “none” }, 5000) }`
| `trigger`         | Dictionary  | Specification of the trigger that activates the weblayer. | `{ type: "onready", delay: 1000 }` |
| `backdrop`        | Dictionary or Boolean | CSS style for the backdrop for the weblayer. Default `false`. | `{ background: rgba(0, 0, 0, 0.5) }` |
| `branded`         | String or Boolean | Adding Exponea branding in the selected color. Default `false`. Available options: `"black"`, `"white"` and `false`. | `"white"` |
| `recommendations` | Dictionary  | Definition of recommendation models used with the banner. | `{ rcm1: {id: "123", total: 4} }` |


### HTML Exp attributes
Exp framework is able to recognize the following set of HTML attributes and add corresponding logic.

| Attribute         | Value       | Description | Example     |
| ----------------- | ----------- | ----------- | ----------- |
| `exp-bind`        | Variable    | Updating text real-time with the value of JavaScript variable (i.e. JavaScript -> HTML binding). | `<span exp-bind="product.name"></span>` |
| `exp-model`       | Variable    | Updates the JavaScript variable value with the input value (i.e. HTML -> JavaScript binding). | `<input exp-model="email">` |
| `exp-if`          | Variable    | Showing element if the value of the variable is true. | `<div exp-if="bonus_club">Discount 50%</div>` |
| `exp-for`         | Iteration   | Copying HTML elements for every element in array and populating it with corresponding values. | `<div exp-for="product in products"><span exp-bind="product.title"></span></div>` |
| `exp-rcm`         | Iteration   | Copying HTML elements for every element in array returned by Exponea recommendation and populating it with corresponding values. | `<div exp-rcm="item in rcm1"><span exp-bind="item.name"></span></div>` |
| `exp-click`       | Method      | Calling a custom method when clicked. | `<button exp-click="submit_form">` |
| `exp-src`         | Variable    | The `img` object will get a source given by the variable value. | `<img exp-src="product.img">` |
| `exp-action`      | N/A         | Clicking will cause a default banner event with `click` action. | `<div class="exponea-button" exp-action><a href="http://exponea.com/careers">Join us!</a></div>` |
| `exp-close`       | N/A         | Clicking will remove banner. | `<button class="exponea-close-button" exp-close></button>` |

Note that there are further special attributes like `exp-click` and `exp-src`, those are `exp-href` and `exp-alt` which update HTML attributes and `exp-submit`, `exp-input`, `exp-hover`, `exp-blur`, `exp-focus`, `exp-mouseenter` and `exp-mouseleave` which add listeners to specific DOM events. Both of these are described in sections bellow.


## Guides


### Initialisation
There three modes in which you can initialise Exp. 
1. **Using already existing DOM element on webpage**
Using value of `el` attribute (in the Exp constructor options), Exp selects element in the DOM, and initialises Exp over it. That is useful, when the website itself uses Exp and the webpage already contains Exp HTML code. For example, `var banner = Exp({el: "#exp-banner"})`.
2. **Inserting your custom HTML code**
Using value of `html` attribute, which contains HTML code as string, it creates the weblayer and inserts it into the DOM element specified through the `insert` attribute. If `insert` is not specified, it adds it to `document.body` by default. For example, `var banner = Exp({insert: "#exp-banner", html: "<p>Hello, World!</p>"})` or just `var banner = Exp({html: "<p>Hello, World!</p>"})`.
3. **Exponea weblayer editor**
This mode utilises the functionality of Exponea JS SDK. You must pass the Exp constructor the `context` attribute. In the Exponea app, you will usually initalise Exp object as `var banner = Exp({ context: this })`, because `this` contains lots of banner information injected by the Exponea JS SDK (for instance it contains HTML and CSS codes). Hence, in case of using `context` you do not need to pass `html` or `style` attributes, because `this` contains HTML and CSS codes from the Exponea weblayer editor. In case you do include `html`, `html` will by default override the HTML code from `context`.


### Model and data binding
The most important concept of Exp is of **model**. That can be thought of as a **store**, containing all the variables and data required by the weblayer. Those can be constants, functions, arrays.

You initialise model with the `data` attribute, for instance, `var banner = Exp({ data: { foo: "bar" }})`. Firstly, Exp creates a variable in the model called `foo` and populates it with value `"bar"`. After the weblayer is rendered, Exp updates the model whenever user performs an action through a binded method. Also conversely, Exp uses the values from the model to update the view. This design is the **Model-View-Controller** (MVC) paradigm.

Having that said, Exp is capable of **two-way binding** between HTML and JavaScript. We can think of the two bindings as **Model-View** and **Controller-Model** bindings.

**Model-View** binding is from JavaScript to HTML. Any changes in the JavaScript model can get reflected on the view. You must use the `exp-bind` attribute in HTML element. For instance, `<p exp-bind="foo"></p>` inserts and updates the text in the element with the current value of `foo` variable in the model, hence after initialization it will be `"bar"`.

**Controller-Model** binding is from HTML to JavaScript. The JavaScript model can get updated from HTML events using the `exp-model` HTML attribute. For instance, `<input exp-model="foo" type="text" />` will update the variable `foo` in the model with the value inserted into the input element by the user.


### Methods
In the methods scope, you can access the model via `this` object. Exp calls methods with the scope of the model. To illustrate the example, suppose we have a banner which shows an incrementing counter.
```html
<div id="banner">
    <p exp-bind="counter"></p>
    <button exp-click="increment">Increment</bind>
    <button exp-click="incrementByTwo">Increment By 2</bind>
</div>
<script>
var banner = new Exp({
    el: "#banner",
    data: {
        counter: 0
    },
    methods: {
        increment: function() {
            this.counter++;
        },
        incrementByTwo: function() {
            this.increment();
            this.increment();
        }
    }
})
</script>
```
Clearly, we can access the model variable `counter` from within the method. The same applies for methods, as illustrated in the `incrementByTwo` method. Exp adds **both variables and methods** into the model.


### Iterations
Exp makes iterating over arrays extremely easy and efficient. When you have an array declared in the model, you can iterate over it in the following fashion.
```html
<div id="banner">
    <div exp-for="number in numbers">
        <p exp-bind="number"></p>
    </div>
    <div exp-for="person in people">
        <p exp-bind="person.age"></p>
        <p exp-bind="person.name"></p>
    </div>
</div>
<script>
var banner = new Exp({
    el: "#banner",
    data: {
        numbers: [1, 2, 3],
        people: [{ age: 21, name: "Lukas" }, { age: 23, name: "Adam" }]
    }
})
</script>
```
Notice that `numbers` array contains primitive values, so we can later access it just by relative variable `number`. On the other hand, `people` is an array of objects, so we have to access nested properties within `exp-for` as `person.age`. There is no limit on the depth of the nesting. 
Also, beware of how Exp renders the `exp-for` elements. The following shall be generated for the snippet above,
```html
<div id="banner">
    <div>
        <p exp-bind="number">1</p>
    </div>
    <div>
        <p exp-bind="number">2</p>
    </div>
    <div>
        <p exp-bind="number">3</p>
    </div>
    <div>
        <p exp-bind="person.age">21</p>
        <p exp-bind="person.name">Lukas</p>
    </div>
    <div>
        <p exp-bind="person.age">23</p>
        <p exp-bind="person.name">Adam</p>
    </div>
</div>
```


### Conditionals
Suppose you want to hide some DOM elements in case of some specific event. You can use the `exp-if` functionality. In the attribute of the HTML element specify the boolean variable, subject to which the DOM element will (dis)appear. For example,
```html
<div>
  <span exp-if="seen">Now you see me</span>
</div>
<script>
var banner3 = new Exp({
    context: this,
    data: {
        seen: false
    }
})
</script>
```
This wil show text *Now you see me* only when `seen` variable is set to `true`.


### HTML element attributes
Currently we support only updating `src`, `href` and `alt` HTML attributes. Suppose you want to update one of these, lets say `href`. Then in your target HTML element create `exp-href` attribute and bind it to any value, as you do normally with `exp-bind`. For example,
```html
<image exp-href="product.url" />
```
Exp then creates a new attribute `href` and pastes in the binded JavaScript value. It also updates the `href` attribute whenever the variable in the model changes. So, after initialisation it can look like this
```html
<image exp-href="product.url" href="www.example.com/product1" />
```


### Listeners to DOM events
Currently we support only listening to `click`, `submit`, `input`, `hover`, `blur`, `focus`, `mouseenter` and `mouseleave` DOM events. If you want to bind some function to this event, suppose you want to add listener to `submit`, then create `exp-submit` attribute in the target element. For example
```html
<form exp-submit="submitForm"></form>
```
In the `methods` section of Exp constructor settings create a function under the key `submitForm`. This function can take one argument (`event`) which is the same as normal [JavaScript listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) do. So, your Exp initalisation can look like
```javascript
var banner = new Exp({
    methods: {
        submitForm: function(e) { /* do stuff */ }
    }
})
```
This will create listener on the `form` element on `submit` event and call `submitForm` function with the `event` as an argument.


### Triggers
With Exp, it became very easy to setup specific predefined scenarios which trigger the weblayer to render. Currently we support `onready`, `onexit` and `onaction` triggers, where each must be declared with different parameters. Lets go through all of them.

#### `onready` trigger
This renders the weblayer once the webpage is fully loaded. You can initalise it in the following manner
```javascript
var banner = new Exp({
    trigger: {
        type: "onready", /* Required. */
        delay: 5000 /* Optional, default 0. Specifies the miliseconds of delay. */
    }
})
```
#### `onexit` trigger
This renders when user moves his coursor to the top of the browser. You can initalise it in the following manner
```javascript
var banner = new Exp({
    trigger: {
        type: "onexit", /* Required. */
        delay: 5000 /* Optional, default 0. Specifies the miliseconds of delay. */
    }
})
```
#### `onaction` trigger
This renders when a specific action listener is triggered. You can initalise it in the following manner
```javascript
var banner = new Exp({
    trigger: {
        type: "onaction", /* Required. */
        element: document.querySelector("#button"), /* Required, the element which the listener will be inserted to. */
        action: "click", /* Required, the DOM event which listener is listening to. */
        delay: 5000 /* Optional, default 0. Specifies the miliseconds of delay. */
    }
})
```


### Recommendations
Exp includes a utility for working with Exponea recommendations. You **must use** the `context` option in the constructor to pass the Exponea JS SDK. Afterwards, use the `exp-rcm` directive, which works the same way as `exp-for` but it does a little more work in the background to make our lives easier.
Below is an example of using `exp-rcm` for rendering 4 products with their image, name, price and link in a table:
```html
<div>
  <table>
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Link</th>
      <th>Image</th>
    </tr>
    <tr exp-rcm="product in products">
      <td exp-bind="product.name"></td>
      <td exp-bind="product.price"></td>
      <td><a exp-href="product.link" target="_blank">link</a></td>
      <td><img exp-src="product.image" width="100"></td>
    </tr>
  </table>
</div>
<script>
var banner = new Exp({
    context: this,
    recommendations: {
        products: {
            id: "recommendationId", /* Required. Valid Exponea recommendation ID */
            total: 4, /* Required. The total amount of recommended items to be displayed */
            loadingKey: "foo" /* Optional, default undefined. Name of the model boolean variable, which is set to true once recommendation is loaded */
        }
    }
})
</script>
```
Note that the `recommendationId` must be a valid recommendation ID generated by Exponea. Example above depicts all the available options.


### Event tracking
Events can be tracked through the Exponea JS SDK **only when you use Exp from Exponea weblayer editor** and instantiate the banner object with the `context: this` attribute. Later, there are two ways how you can track events to Exponea.
1. Setup **default tracking** through settings `tracking: true`
When the banner is displayed to the user it will automatically track `banner` event with `action: show` and attributes including other banner specific properties. Similarly, when a user closes a banner through a DOM element with `exp-close` attribute, a banner event with `action: close` is automatically tracked.

It is possible to disable automatic tracking of the banner by setting `tracking: false` in the Exp constructor settings. By default it is set to `true`.
2. **Custom tracking** through Exponea JS SDK
Users can track from within methods in model by calling `this.sdk.track("eventName", properties)`. For example,
```javascript
var banner = Exp({
    context: this,
    methods: {
        onClick: function() {
            this.sdk.track("cart_update", {})
        }
    }
})
```
