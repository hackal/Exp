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
