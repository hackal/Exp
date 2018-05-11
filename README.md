# Exp framework

## Introduction

Exp framework is a lightweigth minimalistic JavaScript framework designed specifically for building banners in Exponea platform. Many of architectural designs reflect this aim.

One of the main motivations is to code in a declarative manner rather than imperative. Exp framework can be thought of as an engine which performs many unneccessary routines on behalf of you.

Neccesarrily to mention, we have been greatly influenced by already existing frameworks such as Vue.js or AngularJS.

## Installation

1. Clone repository
2. Install dependencies `npm install`
3. Run development server `npm run start`
4. Build `npm run webpack`

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

| Key               | Type        | Description | Example     |
| ----------------- | ----------- | ----------- | ----------- |
| `context`         | Dictionary  | The Exponea weblayer context data that are passed from Exponea JS SDK. | `{ banner_id: "123" }` |
| `data`            | Dictionary  | Data initially populating the model. | `{ sizes: ['large', 'small'], logged_in: false }` |
| `html`            | String      | A custom HTML code of the weblayer (replaces the original Exponea web-layer HTML).  Either `el` or `html` should be used. | `"<div class="test">aaa</div>"` |
| `el`              | String      | Selector which points to an element on which Exp will be initialised. Either `el` or `html` should be used. | `document.querySelector('.exp-banner')` |
| `insert`          | String      | Selector which points to an element that the weblayer should be inserted into as a child. Only if `html` is used. | `document.querySelector('.banner-window')` |
| `style`           | String      | A custom CSS code of the web-layer (replaces the original Exponea web-layer CSS). Only if `insert` is used. | `.test{color: blue;}` |
| `scoped`          | Boolean     | Adding a generated hash to weblayers CSS, causing the CSS to affect only the web-layer. Default `false`. | `true` |
| `tracking`        | Boolean     | Default tracking of events `banner(show)` and `banner(close)`. Default `true`. | `false` |
| `control_group`   | Boolean     | Weblayer will not be shown, but tracking will run as for a custom control group. Default `false`. | `false` |
| `methods`         | Dictionary  | Definition of the user functions, that can be used in JS or triggered by HTML objects. | `{ on_click: () => alert("Hello, World!) }` |
| `mounted`         | Function    | A function that is called when the web-layer is loaded. | `function() { setTimeout(function() { this.ref.header.style.display = “none” }, 5000) }`
| `trigger`         | Dictionary  | Specification of the trigger that activates the weblayer. | `{ type: "onready", delay: 1000 }` |
| `backdrop`        | Dictionary or Boolean | CSS style for the backdrop for the weblayer. Default `false`. | `{ background: rgba(0, 0, 0, 0.5) }` |
| `branded`         | `"black"` or `"white"` or `false` | Adding Exponea branding in the selected color. Default `"black"` | `"white"` |
| `recommendations` | Dictionary  | Definition of recommendation models used with the banner. | `{ rcm1: {id: "123", total: 4} }` |

### HTML Exp attributes
Exp framework is able to recognize the following set of HTML attributes and add corresponding logic.

| Attribute         | Value       | Description | Example     |
| ----------------- | ----------- | ----------- | ----------- |
| `exp-bind`        | Variable    | Updating text real-time with the value of JavaScript variable (i.e. JavaScript -> HTML binding). | `<span exp-bind="product.name"></span>` |
| `exp-model`       | Variable    | Updates the JavaScript variable value with the input value (i.e. HTML -> JavaScript binding). | `<input exp-model="email">` |
| `exp-if`          | Variable    | Showing element if the value of the variable is true. | `<div exp-if="bonus_club">Discount 50%</div>` |
| `exp-for`         | Iteration   | Copying HTML element for every element in array and populating it with corresponding values. | `<div exp-for="product in products"><span exp-bind="product.title"></span><img exp-src="product.url"></div>` |
| `exp-rcm`         | Iteration   | Copying HTML element for every element in array returned by Exponea recommendation and populating it with corresponding values. | `<div exp-rcm="item in rcm1"><span exp-bind="item.name"></span><img exp-src="item.img_src"></div>` |
| `exp-click`       | Method      | Calling a custom method when clicked. | `<button exp-click="submit_form">` |
| `exp-src`         | Variable    | The `img` object will get a source given by the variable value. | `<img exp-src="product.img">` |
| `exp-action`      | N/A         | Clicking will cause a default banner event with `click` action. | `<div class="exponea-button" exp-action><a href="http://exponea.com/careers">Join us!</a></div>`

Note that there are further special attributes `exp-src`, `exp-href` and `exp-alt` which update HTML attributes and `exp-click`, `exp-submit`, `exp-input`, `exp-hover`, `exp-blur`, `exp-focus`, `exp-mouseenter` and `exp-mouseleave` which add listeners to specific DOM events. Both of these are described in sections bellow.

## Guides

### Three modes of initialising Exp
There two modes in which you can initialise Exp. First one, using `el`, selects an already existing HTML element in the DOM, and initialises Exp over it. That is useful, when the website itself uses Exp and the webpage already contains Exp HTML code.
Second one, using `html`, is used when you want to insert banner into the webpage. It inserts the HTML code in the `html` attribute of `settings` object (also adds CSS code in the `style` attribute, if there is one) and inserts as a child of the HTML element specified by the value under `insert` key. If `insert` is not specified, it adds it to `document.body` by default.
Thirdly, you can use `context` attribute, which is useful when usign Exponea app. In that case you will usually initalise it with `this`, as that is passing the context of the banner into the constructor, which already includes HTML and CSS codes. In case of using `context` you do not need to pass `html` or `style` attributes. In case you do include `html`, `html` will be used by default rather than the HTML code from `context`.

### Using methods
In the methods scope, you can access the model via `this` object. Exp calls methods with the scope of the model. To illustrate the example, suppose we have a banner which shows an incrementing counter.
```html
<div id="banner">
    <p exp-bind="counter"></p>
    <button exp-click="increment">Increment</bind>
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
Clearly, we can access the model variable `counter` from within the method. The same applies for methods, as illustrated in the `incrementByTwo` method.

### Iterations over array with `exp-for`
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
Notice that `numbers` array contains primitive values, so we can later access it just by relative variable `number`. On the other hand, `people` is an array of objects, so we have to access nested properties within `exp-for` as `person.age`. There is no limit on the nesting. 
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

### Updating HTML element attributes
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

### Triggers and their usage
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

