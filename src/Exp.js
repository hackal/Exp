class Exp {
    constructor(settings) {
        /* Find application element */
        this.el = settings.el || null;
        this.app = null;
        this.attach = settings.attach || null;

        /* Exp handling HTMl */
        this.html = settings.html || null;

        /* Exp handling styling */
        this.style = settings.style || null;
        this.scoped = settings.scoped || false;

        this.data = settings.data;
        this.methods = settings.methods || {};
        this.mounted = settings.mounted || null;

        /* pass banner context */
        if (settings.context !== undefined) {
            this.context = settings.context;
        } else {
            this.context = null;
        }
        /* pass banner sdk */
        if (settings.sdk !== undefined) {
            this.sdk = settings.sdk;
        } else {
            this.sdk = null;
        }

        /* tracking by default false */
        if (settings.tracking !== undefined) {
            this.tracking = true;
        } else {
            this.tracking = settings.tracking;
        }

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

        if (settings.backdrop) this.addBackdrop();
        if (settings.position) this.moveToPosition(settings.position);
        
        this.loaded();
        this.addAnimationClass();
        this.removeAnimationClass();
        this.bindClose();
        
        return this.model;
    }

    /* initialization logic */
    init() {
        /* handles HTML, EL, APP, attach settings */
        if (this.el !== null) {
            /* find element in place */
            this.app = document.querySelector(this.el);
        } else if (this.html !== null) {
            /* insert HTML to page */
            let el = document.createElement('div');
            el.innerHTML = this.html.trim();

            /* append the element to target or to body */
            if (this.attach !== null) {
                this.app = document.querySelector(this.attach).appendChild(el.firstChild);
            } else {
                this.app = document.body.appendChild(el.firstChild);
            }
        }

        /* handles CSS inserting and scoping */
        if (this.style !== null) {
            if (this.scoped) {
                let style = this.addStyle(this.style, true)
                let rules = this.listify(style.sheet.cssRules);
                var scopedStyle = "";

                /* iterate over CSS rules */
                rules.forEach(rule => {
                    /* rule is actually rule */
                    if (rule instanceof CSSStyleRule) {
                        scopedStyle = scopedStyle + this.generateScopedRule(rule);
                    }

                    /* rule is media query */
                    if (rule instanceof CSSMediaRule) {
                        scopedStyle = scopedStyle + `@media${rule.conditionText} {`
                        this.listify(rule.cssRules).forEach(rule => {
                            scopedStyle = scopedStyle + this.generateScopedRule(rule);
                        });
                        scopedStyle = scopedStyle + `}`;
                    }
                });

                /* append scoped style */
                this.addStyle(scopedStyle);

                /* remove original style */
                style.parentNode.removeChild(style);
            } else {
                /* append style */
                this.addStyle(this.style);
            }
        }

        /* register removeBanner method for use in object */
        this.methods.removeBanner = this.removeBanner.bind(this, this.app);
    }

    getEventProperties(action, interactive) {
        if (this.context === null) return;
        return { 
            action: action,
            banner_id: this.context.banner_id,
            banner_name: this.context.banner_name,
            banner_type: this.context.banner_type,
            variant_id: this.context.variant_id,
            variant_name: this.context.variant_name,
            interaction: interactive !== false ? true : false,
            location: window.location.href,
            path: window.location.pathname
        };
    }

    /* handle POSITION option */
    moveToPosition(position) {
        if (typeof position === "object") {
            this.setStyleFromObject(position, this.app);
        } else {
            this.setPositionFromString(position, this.app);
        }

        /* this is bug, what if element is inserted to page? can't use fixed */
        this.setStyleFromObject({ "position": "fixed" }, this.app)
    }

    /* add inline style to element */
    setStyleFromObject(object, el) {
        for (var property in object) {
            el.style[property] = object[property];
        }
    }

    /* parse POSITION string */
    setPositionFromString(position, el) {
        const offset = "20px";
        const positionStyles = {
            middle: {
                "left": "50%",
                "top": "50%",
                "transform": "translate(-50%,-50%)"
            }
        }
        let positions = position.split(' ');
        positions.forEach(pos => {
            if (pos in positionStyles) {
                this.setStyleFromObject(positionStyles[pos], el);
            } else {
                let styleObj = {}
                styleObj[pos] = offset
                this.setStyleFromObject(styleObj, el);
            }
        });
    }

    /* handle BACKDROP optioin */
    addBackdrop() {
        const backdropStyle = {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100vw",
            "height": "100vh",
            "z-index": "999999",
            "background": "rgba(0,0,0,0.7)"
        }
        let backdrop = document.createElement('div');
        this.setStyleFromObject(backdropStyle, backdrop);
        this.app.style['position'] = "relative";
        this.app.firstChild.style["z-index"] = "9999999";
        this.app.appendChild(backdrop);
    }

    /* call MOUNTED lifecycle hook */
    loaded() {
        /* track 'show' if tracking is set to true */
        if (this.tracking && this.sdk !== null && this.context !== null) {
            this.sdk.track('banner', this.getEventProperties('show', false));
        }
        if (this.mounted !== null) this.mounted.call(this.model);
    }

    /* remove banner */
    removeBanner() {
        this.app.parentNode.removeChild(this.app);
         /* track 'close' if tracking is set to true */
        if (this.tracking && this.sdk !== null && this.context !== null) {
            this.sdk.track('banner', this.getEventProperties('close'));
        }
    }

    /* method for inserting stylesheet */
    addStyle(css, disabled = false){
        let style = document.createElement('style');
        style.type= 'text/css';
        style.appendChild(document.createTextNode(css)); // doesn't work in IE8 and less

        let inserted = this.app.appendChild(style);
        inserted.sheet.disabled = disabled;
        return inserted;
    }

    /* not used, not sure why it is here */
    getSelectorText(rules) {
        var ruleList = [];
        Array.prototype.slice.call(rules).forEach(rule => {
            ruleList.push(rule);
        });
    }

    /* helper method for adding attribute, used by CSS scoping */
    addAttributes(selector, attr, val = "") {
        this.select(selector).forEach(el => {
            el.setAttribute(attr, val);
        })
    }

    /* helper method for generating unique IDs, used by CSS scoping */
    getUuid() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    /* method for adding unique ID to CSS selectors */
    generateScopedRule(rule) {
        let selectors = rule.selectorText.split(',');
        let selectorsText = selectors.map(selector => {
            let attr = `exp-${this.getUuid()}`;
            this.addAttributes(selector.trim(), attr);
            return `${selector}[${attr}]`;
        });

        return `${selectorsText.join()} { ${rule.style.cssText} }`;
    }

    /* move methods from METHODS option to `this` scope */
    moveMethods() {
        if (this.methods === null) return;

        for (var key of Object.keys(this.methods)) {
            this.model[key] = this.methods[key];
        }
    }

    /* method for updating all exp-binds */
    updateBindings(key, value) {
        const bindings = this.select(`*[exp-bind="${key}"]`);

        bindings.forEach(el => {
            el.textContent = value;
        });
    }

    /* method for updating input exp-models */
    updateModels(key, value) {
        const modelBindings = this.select(`*[exp-model="${key}"]`);

        modelBindings.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            
            /* handle different input types */
            if (type == "checkbox") {
                input.checked = !!value;
            } else if (type == "radio") {
                if (input.value == value) input.checked = true;
            } else {
                input.value = value;
            }
        });
    }

    /**
     * method for updating exp-ifs
     * possible bug: doesn't check the original display value, assumes block
     */ 
    updateIfs(key, value) {
        const expIfs = this.select(`*[exp-if="${key}"]`);

        expIfs.forEach(el => {
            el.style.display = (value ? "block" : "none");
        });
    }

    /* watch data model */
    watcher(model) {
        var that = this;
        Object.keys(model).forEach(key => {
            var value = model[key];

            /* define new setters and call updates */
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

    /* initial binding of input models */
    bindModels() {
        let selector = ["email", "number", "search", "tel", "text", "url", "checkbox", "radio"].map(input => {
            return `input[type="${input}"][exp-model]`;
        });
        selector = selector.concat(["textarea[exp-model]", "select[exp-model]"]);

        var inputs = this.select(selector.join());

        inputs.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            
            /* handle different input types */
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

    /* initial bindings of methods */
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

               el.addEventListener(event, function(e) {
                   that.methods[method].apply(that.model, [e]);
               });
           });
       });
    }

    bindClose() {
        let selector = `[exp-close]`;
        var elements = this.select(selector);
        console.log(elements)
        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                this.removeBanner();
            });
        })
    }

    addAnimationClass(className = "exponea-animate") {
        if (this.app.classList) {
            this.app.classList.add(className);
        } else {
            this.app.className += ' ' + className;
        }
    }

    removeAnimationClass(className = "exponea-animate") {
        if (this.app.classList) {
            this.app.classList.remove(className);
        } else {
            this.app.className = this.app.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * helper selecor functions
     */
    listify(list) {
        return Array.prototype.slice.call(list);
    }

    select(selector) {
        var elements = this.listify(this.app.querySelectorAll(selector));
        if (this.app.matches(selector)) {
            elements.push(this.app);
        }

        return elements;
    }
}

window.Exp = Exp;