class Exp {
    constructor(settings) {
        /* Find application element */
        this.el = settings.el || null;
        this.app = null;
        this.attatch = settings.attatch || null;

        /* Exp handling HTMl */
        this.html = settings.html || null;

        /* Exp handling styling */
        this.style = settings.style || null;
        this.scoped = settings.scoped || false;

        this.data = settings.data;
        this.methods = settings.methods || null;
        this.mounted = settings.mounted || null;

        /* init model */
        this.model = {};

        this.init();

        /* init watcher */
        this.watcher(this.data);

        /* bind all models and methods */
        this.bindModels();
        this.bindMethods();

        /* move methods to model for outside use */
        this.moveMethods();

        this.loaded();
        return this.model;
    }

    init() {
        if (this.el !== null) {
            this.app = document.querySelector(this.el);
        } else if (this.html !== null) {
            let el = document.createElement('div');
            el.innerHTML = this.html.trim();
            if (this.attatch !== null) {
                this.app = document.querySelector(this.attatch).appendChild(el.firstChild).parentNode;
            } else {
                this.app = document.body.appendChild(el);
            }
        }

        if (this.style !== null) {
            if (this.scoped) {
                let style = this.addStyle(this.style, true)
                let rules = this.listify(style.sheet.cssRules);
                var scopedStyle = "";

                rules.forEach(rule => {
                    if (rule instanceof CSSStyleRule) {
                        scopedStyle = scopedStyle + this.generateScopedRule(rule);
                    }
                    if (rule instanceof CSSMediaRule) {
                        scopedStyle = scopedStyle + `@media${rule.conditionText} {`
                        this.listify(rule.cssRules).forEach(rule => {
                            scopedStyle = scopedStyle + this.generateScopedRule(rule);
                        });
                        scopedStyle = scopedStyle + `}`;
                    }
                });

                this.addStyle(scopedStyle);
                style.parentNode.removeChild(style);
            } else {
                this.addStyle(this.style);
            }
        }

        this.model.removeBanner = this.removeBanner.bind(this, this.app);
    }

    loaded() {
        if (this.mounted !== null) this.mounted.call(this.model);
    }

    removeBanner() {
        this.app.parentNode.removeChild(this.app);
    }

    addStyle(css, disabled = false){
        let style = document.createElement('style');
        style.type= 'text/css';
        style.appendChild(document.createTextNode(css)); // doesn't work in IE8 and less

        let inserted = this.app.appendChild(style);
        inserted.sheet.disabled = disabled;
        return inserted;
    }

    getSelectorText(rules) {
        var ruleList = [];
        Array.prototype.slice.call(rules).forEach(rule => {
            ruleList.push(rule);
        });
    }

    addAttributes(selector, attr) {
        this.select(selector).forEach(el => {
            el.setAttribute(attr, "");
        })
    }

    getUuid() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    generateScopedRule(rule) {
        let attr = `exp-${this.getUuid()}`;
        let selector = rule.selectorText;
        this.addAttributes(selector, attr);

        return `${selector}[${attr}] { ${rule.style.cssText} }`;
    }

    moveMethods() {
        if (this.methods === null) return;

        for (var key of Object.keys(this.methods)) {
            this.model[key] = this.methods[key];
        }
    }

    updateBindings(key, value) {
        const bindings = this.select(`*[exp-bind="${key}"]`);

        bindings.forEach(el => {
            el.textContent = value;
        });
    }

    updateModels(key, value) {
        const modelBindings = this.select(`*[exp-model="${key}"]`);

        modelBindings.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            
            if (type == "checkbox") {
                input.checked = !!value;
            } else if (type == "radio") {
                if (input.value == value) input.checked = true;
            } else {
                input.value = value;
            }
        });
    }

    updateIfs(key, value) {
        const expIfs = this.select(`*[exp-if="${key}"]`);

        expIfs.forEach(el => {
            el.style.display = (value ? "block" : "none");
        });
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
                    that.updateBindings(key, value);
                    that.updateModels(key, value);
                    that.updateIfs(key, value);
                }
            });

            that.model[key] = value;
        });
    }

    bindModels() {
        let selector = ["email", "number", "search", "tel", "text", "url", "checkbox", "radio"].map(input => {
            return `input[type="${input}"][exp-model]`;
        });
        selector = selector.concat(["textarea[exp-model]", "select[exp-model]"]);

        var inputs = this.select(selector.join());

        inputs.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            
            if (type === "checkbox") {
                input.addEventListener("change", event => {
                    this.model[model] = event.target.checked;
                });
            } else if (type === "radio") {
                input.addEventListener("change", event => {
                    this.model[model] = event.target.value;
                });
            } else {
                input.addEventListener("input", event => {
                    this.model[model] = event.target.value;
                });
            }
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
                   that.methods[method].apply(that.model, [event]);
               });
           });
       });
    }

    listify(list) {
        return Array.prototype.slice.call(list);
    }

    select(selector) {
        return this.listify(this.app.querySelectorAll(selector));
    }
}

window.Exp = Exp;