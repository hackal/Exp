/* Main class */
class Exp {
    constructor(settings) {
        /* Find DOM element which contains Exp code */
        this.el = settings.el || null;
        /* Find DOM element to which append HTML code */
        this.attach = settings.attach || null;

        /* Initializing data model */
        this.data = settings.data || {};
        /* Controller methods */
        this.methods = settings.methods || {};
        /* Initializing model */
        this.model = {};

        /* Initialization of Exp app */
        this.app = null;

        /* Generate Id for banner */
        this.bannerId = 'e-' + this.getUuid();
        /* Dictionaries describing recommendations */
        this.recommendations = settings.recommendations || {};

        /* Scoping CSS rules locally for banner */
        this.scoped = settings.scoped || false;
        /* Function triggered after rendering the banner */
        this.mounted = settings.mounted || null;
        /* Backdrop in front of which Exp app will be rendered */
        this.backdrop = settings.backdrop || null;
        /* Adding Exponea branding options, by default black */
        if (settings.branded === undefined || settings.branded === null || (settings.branded && settings.branded !== "black" && settings.branded !== "white")) {
            this.branded = "black";
        } else {
            this.branded = settings.branded;
        }

        /* Look for either explicit code or for HTML code in context */
        this.html = (_ => {
            if (settings.html !== undefined) return settings.html;
            if (settings.context !== undefined) {
                if (settings.context.html !== undefined) return settings.context.html;
            }
            return null;
        })();
        /* Look for either explicit code or for CSS code in context */
        this.style = (_ => {
            if (settings.style !== undefined) return settings.style;
            if (settings.context !== undefined) {
                if (settings.context.style !== undefined) return settings.context.style;
            }
            return null;
        })();
        /* Exponea SDK passed through context attribute when using production banners */
        this.sdk = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.sdk !== undefined) return settings.context.sdk;
            }

            return null;
        })();
        /* Exponea banner context */
        this.context = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.data !== undefined) return settings.context.data;
            }

            return null;
        })();
        /* Check whether banner is in Exponea editor or not */
        this.inPreview = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.inPreview !== undefined) return settings.context.inPreview;
            }

            return false;
        })();

        /* Internal storage */
        this.__storage = {
            loopDefinitions: {},
            initializedLoops: {}
        };

        /* Tracking by default true. Tracks show/close automatically. */
        if (settings.tracking === undefined) {
            this.tracking = true;
        } else {
            this.tracking = settings.tracking;
        }
        /* Setting trigger for banner display */
        this.trigger = settings.trigger || null;
        
        /* If trigger exists, inject into DOM based on the type of the trigger */
        if (this.trigger !== null && !this.inPreview) {
            if (this.trigger.type == "onready") {
                /* Renders banner once page elements are loaded */
                const delay = this.trigger.delay || 0;
                var self = this;
                window.addEventListener('load', function() {
                    setTimeout(() => {
                        self.inject();
                    }, delay);
                });
                return;
            } else if (this.trigger.type == "onexit") {
                /* Renders banner if user wants to leave the page */
                const delay = this.trigger.delay || 0;
                window.__exp_triggered = false;
                var self = this;
                document.body.addEventListener("mouseleave", function (e) {
                    /* Check window was left */
                    if (e.offsetY - window.scrollY < 0 && !window.__exp_triggered) {
                        window.__exp_triggered = true;
                        setTimeout(() => {
                            self.inject(self);
                        }, delay);
                    }
                });
                return;
            } else if (this.trigger.type = "onaction") {
                /* Renders banner on specific user action */
                var self = this;
                var action = this.trigger.action || "click";
                const delay = this.trigger.delay || 0;
                if (this.trigger.element) {
                    this.trigger.element.addEventListener(action, function() {
                        setTimeout(() => {
                            self.inject(self);
                        }, delay);
                    });
                }
                return;
            } else {
                /* If incorrect type of trigger is given do not render at all */
                throw `Incorrect trigger type ${ this.trigger.type }`;
            }
        }
        /* If no trigger type inject normally */
        return this.inject();
    }

    /* Method for injecting the banner into DOM */
    inject() {
        /* For control group do not inject and only track show */
        if (false) { /* TODO: How to check control_group from context */
            this.loaded();
        }

        /* Initialize model */
        this.initializeModel(this.data);

        /* Render Exp banner */
        this.render();

        /* Create the main tunnel of bindings between HTML with JS */
        this.bindModels();
        this.bindMethods();
        this.bindAttributes();
        this.bindClose();
        this.bindFors();
        this.bindIfs()

        /* Load recommendations */
        this.loadRecommendations()

        /* Renders optional objects alongside with banners */
        if (this.backdrop !== null) this.addBackdrop();
        if (this.branded !== false) this.addBranding();
        /* Adds exponea-animate class to app */
        this.addAnimationClass();

        /* Track show if tracking is set to true  */
        if (this.tracking && this.sdk !== null && this.context !== null) {
            this.sdk.track('banner', this.getEventProperties('show', false));
        }

        /* Call mounted function if set */
        if (this.mounted !== null && !this.control_group) this.mounted.call(this.model);

        return this.model;
    }

    /* Initalize model from data */
    initializeModel(data) {
        var self = this;
        Object.keys(data).forEach(key => {
            var value = data[key];
            /* Define new setters to update model on change */
            Object.defineProperty(self.model, key, {
                enumerable: true,
                get() {
                    return value;
                },
                set(val) {
                    value = val;
                    self.updateBindings(key, value);
                    self.updateModels(key, value);
                    self.updateIfs(key, value);
                    self.updateAttributes(key, value);
                }
            });
            self.model[key] = value;
        });

        /* Copy methods from this.methods to this.model scope so it can be accessed with `this` */
        if (this.methods !== null) {
            for (var key of Object.keys(this.methods)) {
                this.model[key] = this.methods[key];
            }
        }
        /* Bind special methods to be used in `this` scope */
        this.model.removeBanner = this.removeBanner.bind(this, this.app);
        this.model.sdk = this.sdk;
    }

    /* Render Exp banner by injecting it into DOM and adding style */
    render() {
        /* Use el to find element over which to mask Exp */
        if (this.el !== null) {
            this.app = document.querySelector(this.el);
        /* Otherwise check for HTML code which would be created and injected into DOM */
        } else if (this.html !== null) {
            /* Insert HTML to page */
            let el = document.createElement('div');
            el.innerHTML = this.html.trim();
            /* Append the element to target or to body */
            if (this.attach !== null) {
                this.app = document.querySelector(this.attach).appendChild(el.firstChild);
            } else {
                this.app = document.body.appendChild(el.firstChild);
            }
        } else {
            return;
        }
        /* Handles CSS inserting and scoping */
        if (this.style !== null) {
            if (this.scoped) {
                /* Quickly add style which is disabled, rename it and remove it */
                let style = this.addStyle(this.style, true)
                let rules = this.listify(style.sheet.cssRules);
                var scopedStyle = "";
                /* Iterate over CSS rules */
                rules.forEach(rule => {
                    /* Check rule is instances of CSSStyleRule */
                    if (rule instanceof CSSStyleRule) {
                        scopedStyle = scopedStyle + this.generateScopedRule(rule);
                    }
                    /* Rule is media query */
                    if (rule instanceof CSSMediaRule) {
                        scopedStyle = scopedStyle + `@media ${rule.conditionText} {`
                        this.listify(rule.cssRules).forEach(rule => {
                            scopedStyle = scopedStyle + this.generateScopedRule(rule);
                        });
                        scopedStyle = scopedStyle + `}`;
                    }
                });
                /* Append scoped style */
                this.addStyle(scopedStyle);
                /* Remove original style */
                style.parentNode.removeChild(style);
            } else {
                /* Append style with global scope */
                this.addStyle(this.style);
            }
        }
    }

    /* Initial binding of input models */
    bindModels() {
        let selector = ["email", "number", "search", "tel", "text", "url", "checkbox", "radio"].map(input => {
            return `input[type="${input}"][exp-model]`;
        });
        selector = selector.concat(["textarea[exp-model]", "select[exp-model]"]);
        /* Find all input elements */
        var inputs = this.select(selector.join());
        inputs.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            /* Handle different input types */
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

    /* Initial bindings of methods */
    bindMethods(template = undefined) {
        var self = this;
        let supportedEvents = ["click", "submit", "input", "hover", "blur", "focus", "mouseenter", "mouseleave"];
        let selector = supportedEvents.map(event => {
            return `*[exp-${event}]`;
        });
        var events = this.select(selector.join(), template);
        events.forEach(el => {
            supportedEvents.forEach(event => {
                var method = el.getAttribute('exp-' + event);
                if (method === null || !(method in self.methods)) return;
                /* If exp-action is declared then add appropriate EventListener */
                el.addEventListener(event, function(e) {
                    self.methods[method].apply(self.model, [e]);
                });
            });
        });
    }

    /* Binds DOM object attribute values with model */
    bindAttributes() {
        const self = this;
        const supportedAttributes = ["src", "href", "alt"];
        let selector = supportedAttributes.map(attr => {
            return `*[exp-${attr}]`;
        });
        const elements = this.select(selector.join());
        elements.forEach(el => {
            supportedAttributes.forEach(attr => {
                var val = el.getAttribute('exp-' + attr);
                if (val === null || !(val in self.model)) return;
                /* Update value according to data in model */
                el.setAttribute(attr, self.model[val]);
            })
        })
    }

    /* Binds the close button with tracking and deleting functionality */
    bindClose() {
        let selector = `[exp-close]`;
        var elements = this.select(selector);
        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.removeBanner();
                /* Track 'close' if tracking is set to true */
                if (this.tracking && this.sdk !== null && this.context !== null) {
                    this.sdk.track('banner', this.getEventProperties('close'));
                }
            });
        })
    }

    /* Bind exp-ifs */ 
    bindIfs() {
        const expIfs = this.select(`[exp-if]`);
        expIfs.forEach(el => {
            /* BUG: does not check the original display value, assumes block */
            const attr = el.getAttribute("exp-if");
            if (this.model[attr] !== null && this.model[attr] !== undefined) {
                el.style.display = (this.model[attr] ? "block" : "none");
            } else {
                throw `exp-if attribute ${attr} is not defined in model.`
                this.model[attr] = null;
            }
        });
    }

    /* Creates access to elements from model scope */
    bindRefs() {
        let selecor = `[exp-ref]`;
        var elements = this.select(selecor);
        elements.forEach(el => {
            let val = el.getAttribute('exp-ref');
            if (val && val !== '') {
                this.model.$refs[val] = el
            }
        });
    }

    /* Instantiates and binds exp-for with model */
    bindFors() {
        const expFors = this.select(`[exp-for], [exp-rcm]`);
        expFors.forEach(expFor => {
            /* Tokenize and parse attribute */
            let attr = expFor.hasAttribute('exp-for') ? 'exp-for' : 'exp-rcm';
            let key = expFor.getAttribute(attr).split(' ')[0];
            let arrayName = expFor.getAttribute(attr).split(' ')[2];
            let hash = 'e-' + this.getUuid();
            let template = expFor.cloneNode(true);
            /* Copy template into storage, with the root element */
            if (arrayName in this.__storage.loopDefinitions) {
                this.__storage.loopDefinitions[arrayName].push({
                    template: template,
                    root: expFor
                });
            } else {
                this.__storage.loopDefinitions[arrayName] = [{
                    template: template,
                    root: expFor
                }];
            };
            /* Remove all children elements */
            while (expFor.firstChild) {
                expFor.removeChild(expFor.firstChild);
            }
            /* Check if array exists in model and render multiple templates */
            if (this.model[arrayName]) {
                this.model[arrayName].forEach(item => {
                    this.renderNewElement(arrayName, key, item);
                });
            } else {
                this.model[arrayName] = [];
            }
            /* Override the push method of array in the model for reactivity */
            this.overridePush(this.model[arrayName], arrayName, key);
        });
    }

    /* Method for updating all exp-binds */
    updateBindings(key, value) {
        const bindings = this.select(`*[exp-bind="${key}"]`);
        bindings.forEach(el => {
            el.textContent = value;
        });
    }

    /* Method for updating input exp-models */
    updateModels(key, value) {
        const modelBindings = this.select(`*[exp-model="${key}"]`);
        modelBindings.forEach(input => {
            const model = input.getAttribute("exp-model");
            const type = input.getAttribute("type");
            /* Handle different input types */
            if (type == "checkbox") {
                input.checked = !!value;
            } else if (type == "radio") {
                if (input.value == value) input.checked = true;
            } else {
                input.value = value;
            }
        });
    }

    /* Method for updating exp-ifs */ 
    updateIfs(key, value) {
        const expIfs = this.select(`*[exp-if="${key}"]`);
        expIfs.forEach(el => {
            /* BUG: does not check the original display value, assumes block */
            el.style.display = (value ? "block" : "none");
        });
    }

    /* Method for updating attributes */
    updateAttributes(key, value) {
        const supportedAttributes = ["src", "href", "alt"];
        let selector = supportedAttributes.map(attr => {
            return `*[exp-${attr}="${key}"]`;
        });
        const that = this;
        const elements = this.select(selector.join());

        elements.forEach(el => {
            supportedAttributes.forEach(attr => {
                var val = el.getAttribute('exp-' + attr);
                if (val === null || !(val in that.model)) return;
                
                el[attr] = that.model[val];
            })
        });
    }


    /* Renders a new element of an array */
    renderNewElement(arrayName, key, item) {
        const supportedAttributes = ["src", "href", "alt"];
        /* Iterate through all exp-for instances linked to targeted array */
        for (expForInstance of this.__storage.loopDefinitions[arrayName]) {
            /* Clone the template and populate it with element data */
            var template = expForInstance.template.cloneNode(true);
            let attrSelector = supportedAttributes.map(attr => {
                return `*[exp-${attr}]`;
            });
            const expAttrs = this.select(attrSelector.join(), template);
            const expBinds = this.select(`[exp-bind]`, template);
            /* Override attributes of the node */
            expAttrs.forEach(el => {
                supportedAttributes.forEach(attr => {
                    const val = el.getAttribute('exp-' + attr);
                    if (val === null) return;
                    if (val.indexOf('.') == -1) {
                        el[attr] = item;
                    } else {
                        const keys = val.split('.');
                        const value = this.findLastField(keys.slice(1), item);
                        el[attr] = value;
                    };
                });
            });
            /* Override inner value of the node */
            expBinds.forEach(el => {
                const val = el.getAttribute('exp-bind');
                if (val.indexOf('.') == -1) {
                    el.textContent = item;
                } else {
                    const keys = val.split('.');
                    var value = this.findLastField(keys.slice(1), item);
                    el.textContent = value
                }
            });
            /* Append all children of the newly populated template */
            let children = this.listify(template.childNodes)
            for (let i=0; i<children.length; i++) {
                if (children[i].nodeType == 1){
                    expForInstance.root.appendChild(children[i]);
                }
            } 
        }
    }

    /* Override the push function with reactivity functionality */
    overridePush(array, arrayName, key) {
        let self = this;
        array.push = (_ => {
            var original = Array.prototype.push;
            return function() {
                const ret = original.apply(this, arguments);
                self.renderNewElement(arrayName, key, arguments[0]);
                return ret;
            };
        })();
    }

    /* Method for inserting stylesheet */
    addStyle(css, disabled = false){
        if (this.app === null) return;
        var style = document.createElement('style');
        style.type= 'text/css';
        style.appendChild(document.createTextNode(css)); /* BUG: Does not work in IE8 or less */
        var inserted = this.app.appendChild(style);
        inserted.sheet.disabled = disabled;
        return inserted;
    }

    /* Method for adding unique ID to CSS selectors */
    generateScopedRule(rule) {
        let selectors = rule.selectorText.split(',');
        let selectorsText = selectors.map(selector => {
            let attr = `exp-${this.getUuid()}`;
            this.addAttributes(selector.trim(), attr);
            if (selector.includes(".exponea-animate")) {
                return `${selector}[${this.bannerId}]`
            }
            if (this.select(selector.trim()).length > 0) {
                return `${selector}[${attr}]`;
            }
            return  `${selector}`;
        });
        return `${selectorsText.join()} { ${rule.style.cssText} }`;
    }

    /* Handle backdrop option */
    addBackdrop() {
        if (this.app == null) return;
        /* Set default backdrop style */
        let backdropStyle = { 
            "position": "fixed",
            "top": "0",
            "left": "0",
            "width": "100vw",
            "height": "100vh",
            "z-index": "9999",
            "background": "rgba(0,0,0,0.7)"
        }
        /* Customize backdrop. If style=true then iterates over an empty array */
        for (var key of Object.keys(this.backdrop)) {
            backdropStyle[key] = this.backdrop[key];
        }
        /* Inject element into DOM */
        let backdrop = document.createElement('div');
        this.setStyleFromObject(backdropStyle, backdrop);
        this.app.parentNode.style['position'] = "relative";
        this.app.style["z-index"] = "9999999";
        this.backdrop = this.app.parentNode.appendChild(backdrop);
        /* Add event listener which removes banner on click */
        this.backdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.removeBanner();
        })
    }

    /* Adds Powered by Exponea branding */
    addBranding() {
        if (this.app === null) return;
        var branding = document.createElement('object');
        var uuid = this.getUuid();
        this.app.appendChild(branding);
        branding.innerHTML = '<a href="https://exponea.com/?utm_campaign=exponea-web-layer&amp;utm_medium=banner&amp;utm_source=referral" e' + uuid + ' target="_blank">Powered by Exponea</a>';
        this.addStyle('[e' + uuid + ']{font-size:11px;position:absolute;color:' + this.branded + ';opacity:.6;right:5px;bottom:5px;padding-top:0;text-decoration:none}[e' + uuid + ']:hover{opacity:.9}');
    }

    /* Adds exponea-animate class which is responsible for smooth transitions */
    addAnimationClass(className = "exponea-animate") {
        if (this.app === null) return;
        if (this.app.classList) {
            this.app.setAttribute(this.bannerId, '');
            this.app.classList.add(className);
        } else {
            this.app.className += ' ' + className;
        }
    }

    /* Loads Exponea recommendation and inserts into model */
    loadRecommendations() {
        Object.keys(this.recommendations).forEach((rcm) => {
            /* Has to already exist due to exp-for initialization */
            if (this.model[rcm]) {
                /* Option parameters according to Exponea JS SDK */
                var options = {
                    recommendationId: this.recommendations[rcm].id,
                    size: this.recommendations[rcm].total,
                    callback: data => {
                        /* Push to model */
                        if (data && data.length > 0) {
                            data.forEach(item => {
                                this.model[rcm].push(item)
                            })
                        }
                        /* Update loading key */
                        if (this.recommendations[rcm].loadingKey !== undefined) {
                            this.model[this.recommendations[rcm].loadingKey] = true;
                        }
                    },
                    fillWithRandom: true
                };
                /* Generate recommendation */
                if (this.sdk && this.sdk.getRecommendation) {
                    this.sdk.getRecommendation(options);
                } else {
                    if (this.recommendations[rcm].loadingKey !== undefined) {
                        this.model[this.recommendations[rcm].loadingKey] = true;
                    }
                }
            }
        })
    }

    /* Remove banner */
    removeBanner() {
        if (this.app === null) return
        this.app.parentNode.removeChild(this.app);
        if (this.backdrop !== null) this.backdrop.parentNode.removeChild(this.backdrop);
    }

    /**
     * Helper functions
     */

    /* Return Array from DOM elements collection list */
    listify(list) {
        return Array.prototype.slice.call(list);
    }
    /* Return array from querySelector */
    select(selector, scope = this.app) {
        if (scope === null) return []
        var elements = this.listify(scope.querySelectorAll(selector));
        if (scope.matches(selector)) {
            elements.push(scope);
        }
        return elements;
    }
    /* Helper method for adding attribute, used by CSS scoping */
    addAttributes(selector, attr, val = "") {
        this.select(selector).forEach(el => {
            el.setAttribute(attr, val);
        })
    }
    /* Helper method for generating unique IDs, used by CSS scoping */
    getUuid() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }
    /* Add inline style to element */
    setStyleFromObject(object, el) {
        for (var property in object) {
            el.style[property] = object[property];
        }
    }
    /* Helper method for creating event attributes for tracking */
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
    /* Helper method for finding nested fields in nested dictionaries */
    findLastField(items, dict) {
        if (items.length == 1) return dict[items[0]];
        else return rec(items.slice(1), dict[items[0]]);
    }
}

window.Exp = Exp;
