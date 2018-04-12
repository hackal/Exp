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
# EXP Framework Cookbook
Welcome to the Exponea EXP Framework cookbook.
## What is EXP Framework?
EXP is a framework, that allows the user to handle Exponea web-layers easily, offering a variety of different settings for their behaviour. 
| Version | Date Updated | Author |
|--|--|--|
| Alpha 0.3 | 2018-04-03 | Roman Kluvanec

## Initialization
To create and display a web-layer, you need to initialize a new `Exp()` object. There are many initialzation parameters that define the behaviour of the banner.
| Name | Value | Description | Example |
|--|--|--|--|
| context | JSON | The Exponea web-layer context data (id, name, etc.) that are passed from SDK. Can be found as self object. | self
| el | CSS selector | CSS selector of a DOM Object that the web-layer should be inserted into. | '.banner-window'
| attach | DOM Object | DOM Object that will be the parent object of the web-layer. | document.querySelector('.banner-window')
| html | String | A custom HTML code of the web-layer (replaces the original Exponea web-layer HTML). | `"<div class="test">aaa</div>"`
| style | String | A custom CSS code of the web-layer (replaces the original Exponea web-layer CSS). | `.test{color: blue;}`
| scoped | Boolean | If set to true, web-layer object and CSS will get a generated hash attribute, causing the CSS to affect only the web-layer. | true
| tracking | Boolean | If true, default Exponea banner events will be tracked | true
| control_group | Boolean | If true, web-layer will not be shown, but tracking will run as for a Custom Control Group. | true
| data | JSON | Definition of the used variables, that can be accessed both by HTML and JS, allowing the user to for example to bind an input box value to a varible. | {name: "", email:"sample@mail.com"}
| methods | JSON | Definition of the user functions, that can be used in JS or triggered by HTML objects. | { change_color: function(){ this.ref.button.style.background-color = "red"; }}
| mounted | function() | A function that is called when the web-layer is loaded. | function(){ setTimeout(function(){ this.ref.header.style.display = "none";}, 5000)}
| trigger | JSON | A type of action that will trigger the banner. There are 3 possible triggers - onready, onexit, onaction. Each of the trigger has its own custom required parameters, please see the table below. | {type: onready, delay: 1000} 
| backdrop | JSON / true | If the attribute is present, a backdrop of the given rgba color will be rendered with the web-layer | {background: rgba(0, 0, 0, 0.5)}
| branded | "black" / "white" / false | If not false, "Powered by Exponea" branding will be added to the banner in the selected color (default: black) | "white"
| recommendation | JSON | Definition of recommendation models used with the banner. Each used recommendation has its own name and should be defined by its id and total number of products. It can be later accessed in HTML by exp-rcm attribute | `{rcm1: {id: "123", total: 4}, rcm2: {id: "456", total: 2}}`
### Trigger types
#### On Ready
Renders the web-layer immidiately after processing the data and bindings.
| Parameter | Value | Description | Example
|--|--|--|--|
| type | "onready" | The name of the trigger | "onready"
| delay | Integer | The delay time of displaying the web-layer in ms| 5000
#### On Exit
Renders the web-layer when customer moves his coursor to the top of the browser.
| Parameter | Value | Description | Example
|--|--|--|--|
| type | "onexit" | The name of the trigger | "onexit"
| delay | Integer | The delay time of displaying the web-layer in ms| 5000
#### On Action
Renders the web-layer when a specific action listener is triggered.
| Parameter | Value | Description | Example
|--|--|--|--|
| type | "onaction" | The name of the trigger | "onaction"
| element | DOM element | The DOM element that the listener will be binded to | document.querySelector("button.submit")
| action | String | Name of the action of the listener | "click"
| delay | Integer | The delay time of displaying the web-layer in ms| 5000

### Example initialization code:

    var banner = new Exp({
	    html: this.html,
	    style: this.style,
	    context: this.data,
	    sdk: infinario,
	    tracking: true,
	    scoped: true,
	    data: {
		    name: "",
		    email: "sample@mail.com",
		},
		methods: {
			submit_form: function(){
				this.data.email = exponea.validateEmail(this.data.email);
				if(this.data.email){
					this.sdk.track('form_submit',{
						name: this.data.name,
						email: this.data.email
					});
				}
			}
		},
		backdrop: {
			background: rgba(0, 0, 0, 0.5)
		}
	}
	
## HTML attributes
EXP framework allows the user to add various attributes to dynamically change the HTML objects of the web-layer and their content.
| Name | Value | Description | Example
|--|--|--|--|
| exp-action | - | Default banner event with action: "click" will be tracked when clicking the object with this attribute. | `<div class="exponea-button" exp-action><a href="http://exponea.com/careers">Join us!</a></div>`
| exp-if | Variable name | The object with the attribute will be visible iff the value of the variable is true. **Disclaimer**: When the object is displayed again, it gets the `display: block` style attribute. | `<div exp-if="bonus_club">Discount 50%</div>`
| exp-bind | Variable name | The object with the attribute will have its text updated real-time to the value of the variable | `<span exp-bind="product.name"></span>`
| exp-for | Iterative definition | The object with the attribute will be created for each item in the array, allowing objects inside the main object to read the values of the items in the array. | `<div exp-for="product in products"><span exp-bind="product.title"></span><img exp-src="product.url"></div>`
| exp-model | Variable name | The object with the attribute will have a two-way binding of its value and the variable value, e.g. allows us to bind an inputbox value to its variable. | `<input exp-model="email">`
| exp-ref | Object name | If you add an exp-ref attribute to an object, you can refer to this object in JS under this.$refs.object_name | <
| exp-click | Method name | The object will call a custom Exp method when clicked | `<button exp-click="submit_form">`
| exp-submit | Method name | The object will call a custom Exp method when submitted| `<form exp-submit="submit_form">`
| exp-hover | Method name | The object will call a custom Exp method when hovered | `<span exp-hover="show_info">See more</span>`
| exp-input | Method name | The object will call a custom Exp method when it gets an input | `<input exp-input="validate_input">`
| exp-src | Variable name | The img object will get a source given by the variable value | `<img exp-src="product.img">`
| exp-href | Variable name | The DOM object will get a href attribute given by the variable value | `<a href-src="product.link">Click here</a>`
| exp-alt | Variable name | The DOM object will get an alt attribute given by the variable value | `<img exp-src="product.img" exp-alt="product.name">`
| exp-rcm | Iterative definition | The DOM object with the attribute will be created for each item in the recommendation, allowing objects inside the main object to read the values of the products. | `<div exp-rcm="item in rcm1"><span exp-bind="item.name"><img exp-src="item.img_src"></div>`
