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

    bindMethods() {
        var that = this;
        let supportedEvents = ["click", "submit", "input"];
        let selector = supportedEvents.map(event => {
            return `*[exp-${event}]`;
        })

        var events = this.select(selector.join());

       events.forEach(el => {
           supportedEvents.forEach(event => {
               var method = el.getAttribute('exp-' + event);
               if (method === null || !(method in that.methods)) return;

               el.addEventListener(event, function() {
                   that.methods[method].apply(that.model);
               });
           });
       });
    }

    select(selector) {
        return Array.prototype.slice.call(this.app.querySelectorAll(selector));
    }
}

window.Exp = Exp;