class Exp {
    constructor(settings) {
        /* Find application element */
        this.app = document.querySelector(settings.el);

        this.data = settings.data;
        this.methods = settings.methods;

        /* init model */
        this.model = {};

        /* init watcher */
        this.watcher(this.data);

        /* init exp-for */
        this.initFor(this.data);

        /* bind all models and methods */
        this.bindModels();
        this.bindMethods();

        /* move methods to model for outside use */
        this.moveMethods();

        return this.model;
    }

    moveMethods() {
        for (var key of Object.keys(this.methods)) {
            this.model[key] = this.methods[key];
        }
    }

    // replicate exp-for elements and populate model with array variables
    initFor(model) {
        var that = this;
        var fors = that.select(`[exp-for]`);
        fors.map(el => {
            // tokens = ["item", "in", "items"]
            const tokens = el.getAttribute('exp-for').split(' ');
            let template = document.createElement("div");
            while (el.hasChildNodes()) template.appendChild(el.firstChild);
            const local_var = tokens[0];
            const parent_var = tokens[2];
            if (tokens[1] != 'in') return;
            // for each item in array add another replica
            model[parent_var].map((item, index) => {
                // populating template with specific virtual variables
                let specific_template = template.cloneNode(true);
                // TODO -> has to be a unique id
                const id = parent_var + "_" + local_var + "_" + index;
                specific_template.id = id;
                // set exp-bind of child elements to reference virtual variable
                for (var child of Array.prototype.slice.call(specific_template.querySelectorAll(`*[exp-bind^="${local_var}"`))) {
                    let binded_var = child.getAttribute('exp-bind');
                    binded_var = binded_var.split('.');
                    binded_var[0] = id;
                    binded_var = binded_var.join('.');
                    child.setAttribute('exp-bind', binded_var);
                };
                // append virtual variable to model
                model[id] = item;
                el.appendChild(specific_template);
            })
        })
    }

    // bind HTML elements to changes in JavaScript model
    watcher(model) {
        var that = this;
        Object.keys(model).forEach(key => {
            var value = model[key];

            Object.defineProperty(that.model, key, {
                enumerable: true,
                get() {
                    return value;
                },
                set(val) {
                    value = val;
                    var bindings = that.select(`*[exp-bind="${key}"]`);
                    var modelBindings = that.select(`*[exp-model="${key}"]`);
                    var expIfs = that.select(`*[exp-if="${key}"]`);
                    bindings.forEach(el => {
                        el.textContent = value;
                    });
                    modelBindings.forEach(el => {
                        el.value = value;
                    })

                    expIfs.forEach(el => {
                        if (value) {
                            el.style.display = "block";
                        } else {
                            el.style.display = "none";
                        }
                    })
                }
            });

            that.model[key] = value;
        });
    }

    // bind JavaScript model to changes in HTML elements
    bindModels() {
        let selector = ["email", "number", "search", "tel", "text", "url"].map(input => {
            return `input[type="${input}"][exp-model]`;
        })

        var inputs = this.select(selector.join());

        inputs.forEach(input => {
            let model = input.getAttribute("exp-model");
            input.value = this.model[model];

            input.addEventListener("input", event => {
                this.model[model] = event.target.value;
            });
        });
    }

    // bind HTML events to JavaScript methods defined by user
    bindMethods() {
        var that = this;
        let supportedEvents = ["click", "submit", "input"];
        let selector = supportedEvents.map(event => {
            return `*[exp-${event}]`;
        })

        var events = this.select(selector.join());
        console.log(events);

        events.forEach(el => {
            supportedEvents.forEach(event => {
                var method = el.getAttribute('exp-' + event);
                if (method === null || !(method in that.methods)) return;

                el.addEventListener(event, function() {
                    console.log(that.methods)
                    that.methods[method].apply(that.model);
                });
            });
        });
    }

    select(selector) {
        return Array.prototype.slice.call(this.app.querySelectorAll(selector));
    }
}
