class Exp {
    constructor(settings) {
        /* Find application element */
        this.el = settings.el || null;
        this.app = null;
        this.attach = settings.attach || null;

        this.recommendations = settings.recommendations || {};
        this.scoped = settings.scoped || false;

        this.data = settings.data;
        this.methods = settings.methods || {};
        this.mounted = settings.mounted || null;

        this.__storage = {
            loopDefinitions: {}
        };

        this.html = (_ => {
            if (settings.html !== undefined) return settings.html;
            if (settings.context !== undefined) {
                if (settings.context.html !== undefined) return settings.context.html;
            }

            return null;
        })();

        this.style = (_ => {
            if (settings.style !== undefined) return settings.style;
            if (settings.context !== undefined) {
                if (settings.context.style !== undefined) return settings.context.style;
            }

            return null;
        })();

        this.sdk = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.sdk !== undefined) return settings.context.sdk;
            }

            return null;
        })();

        this.context = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.data !== undefined) return settings.context.data;
            }

            return null;
        })();

        this.inPreview = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.inPreview !== undefined) return settings.context.inPreview;
            }

            return false;
        })();

        /* tracking by default false */
        if (settings.tracking === undefined) {
            this.tracking = true;
        } else {
            this.tracking = settings.tracking;
        }

        this.trigger = settings.trigger || null;
        this.control_group = settings.control_group || false;
        if (settings.branded === undefined || (settings.branded !== "black" && settings.branded !== "white")) {
            this.branded = 'black';
        } else {
            this.branded = settings.branded;
        }
        this.supportedAttributes = ["src", "href", "alt"];
        /* init model */
        this.model = {};

        /* method for rendering the banner */
        var render = function(self) {
            if(!self.control_group){
                self.init();
                /* init watcher */
                self.watcher(self.data);
                /* bind all models and methods */
                self.bindModels();
                self.bindMethods();
                /* move methods to model for outside use */
                self.moveMethods();
                if (settings.backdrop) self.addBackdrop();
                if (settings.position) self.moveToPosition(settings.position);
            }
            self.loaded();
            if(!self.control_group){
                if(self.branded === "white"){
                    self.addBranding("white");
                } else if(self.branded){
                    self.addBranding("black");
                }
                self.addAnimationClass();
                self.bindAttributes();
                self.bindFors();
                self.loadRcm();
                self.bindClose();
            }
            return self.model;
        }

        /* if trigger exists, render based on the type of the trigger */
        if (this.trigger !== null && (this.context !== null && this.context.inPreview === false)) {
            if (this.trigger.type == "onready") {
                /* renders banner once page's elements are rendered */
                const delay = this.trigger.delay || 0;
                var self = this;
                window.addEventListener('load', function() {
                    setTimeout(() => {
                        render(self);
                    }, delay);
                });
                return;
            } else if (this.trigger.type == "onexit") {
                /* renders banner if user wants to leave the page */
                const delay = this.trigger.delay || 0;
                window.__exp_triggered = false;
                var self = this;
                document.body.addEventListener("mouseleave", function (e) {
                    /* check window was left */
                    if (e.offsetY - window.scrollY < 0 && !window.__exp_triggered) {
                        window.__exp_triggered = true;
                        setTimeout(() => {
                            render(self);
                        }, delay);
                    }
                });
                return;
            } else if (this.trigger.type = "onaction"){
                var self = this;
                var el = this.trigger.element;
                var action = this.trigger.action || "click";
                const delay = this.trigger.delay || 0;
                if(el){
                    el.addEventListener(action, function(){
                        setTimeout(() => {
                            render(self);
                        }, delay);
                    });
                }
                return;
            } else {
                /* if incorrect type of trigger is given do not render at all */
                return;
            }
        }

        return render(this);
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
        this.model.sdk = this.sdk;
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
        console.log()
        if (this.tracking && this.sdk !== null && this.context !== null) {
            this.sdk.track('banner', this.getEventProperties('show', false));
        }
        if (this.mounted !== null && !this.control_group) this.mounted.call(this.model);
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

    /* cool hack */
    overridePush(array, arrayName, key) {
        let self = this;
        array.push = (_ => {
            var original = Array.prototype.push;
            return function() {
                const ret = original.apply(this, arguments);
                self.updateFors(arrayName, key, arguments[0]);
                return ret;
            };
        })();
    }

    rec(items, dict) {
        if (items.length == 1) return dict[items[0]];
        else return rec(items.slice(1), dict[items[0]]);
    }

    updateFors(arrayName, key, item) {
        const template = this.__storage.loopDefinitions[arrayName].cloneNode(true);
        
        let attrSelector = this.supportedAttributes.map(attr => {
            return `*[exp-${attr}]`;
        });

        const expFors = this.select(`[exp-for="${key} in ${arrayName}"]`);
        const expAttrs = this.select(attrSelector.join(), template);
        const expBinds = this.select(`[exp-bind]`, template);

        expAttrs.forEach(el => {
            this.supportedAttributes.forEach(attr => {
                const val = el.getAttribute('exp-' + attr);
                if (val === null) return;

                if (val.indexOf('.') == -1) {
                    el[attr] = item;
                } else {
                    const keys = val.split('.');
                    const value = this.rec(keys.slice(1), item);
                    el[attr] = value;
                };
            });
        });

        expBinds.forEach(el => {
            const val = el.getAttribute('exp-bind');
            if (val.indexOf('.') == -1) {
                el.textContent = item;
            } else {
                const keys = val.split('.');
                var value = this.rec(keys.slice(1), item);
                el.textContent = value
            }
        });

        this.bindMethods(template);

        expFors.forEach(expFor => {
            let el = document.createElement('div');
            el.innerHTML = template.innerHTML;
            expFor.appendChild(el);
            this.bindMethods(el);
        });
    }

    loadRcm() {
    	const keys = Object.keys(this.recommendations);
        for (let i = 0; i < keys.length; i++) {
            if (this.model[keys[i]]) {
                var options = {
                    recommendationId: this.recommendations[keys[i]].id,
                    size: this.recommendations[keys[i]].total,
                    callback: data => {
                        if (data && data.length > 0) {
                            data.forEach(item => {
                                this.model[keys[i]].push(item)
                            })
                        }
                    },
                    fillWithRandom: true
                };

                this.sdk.getRecommendation(options);
            }
        }
    }

    bindFors() {
        const expFors = this.select(`[exp-for], [exp-rcm]`);
        expFors.forEach(expFor => {
            let key = expFor.getAttribute('exp-for').split(' ')[0];
            let arrayName = expFor.getAttribute('exp-for').split(' ')[2];

            this.__storage.loopDefinitions[arrayName] = expFor.cloneNode(true);
            expFor.innerHTML = '';

            if (this.model[arrayName]) {
                this.overridePush(this.model[arrayName], arrayName, key);
                this.model[arrayName].forEach(item => {
                    this.updateFors(arrayName, key, item);
                })
            } else {
                this.model[arrayName] = [];
                this.overridePush(this.model[arrayName], arrayName, key);
            }
        })
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
                    that.updateAttributes(key, value);
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

    updateAttributes(key, value) {
        let selector = this.supportedAttributes.map(attr => {
            return `*[exp-${attr}="${key}"]`;
        });
        const that = this;
        const elements = this.select(selector.join());

        elements.forEach(el => {
            this.supportedAttributes.forEach(attr => {
                var val = el.getAttribute('exp-' + attr);
                if (val === null || !(val in that.model)) return;
                
                el[attr] = that.model[val];
            })
        });
    }

    bindAttributes() {
        let selector = this.supportedAttributes.map(attr => {
            return `*[exp-${attr}]`;
        });
        const that = this;
        const elements = this.select(selector.join());
        elements.forEach(el => {
            this.supportedAttributes.forEach(attr => {
                var val = el.getAttribute('exp-' + attr);
                if (val === null || !(val in that.model)) return;
                
                el[attr] = that.model[val];
            })
        })
    }

    /* initial bindings of methods */
    bindMethods(template = undefined) {
        var that = this;
        let supportedEvents = ["click", "submit", "input", "hover", "blur"];
        let selector = supportedEvents.map(event => {
            return `*[exp-${event}]`;
        });

        var events = this.select(selector.join(), template);

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

    addBranding(color){
        var branding = document.createElement('object');
        var uuid = this.getUuid();
        this.app.appendChild(branding);
        branding.innerHTML = '<a href="https://exponea.com/?utm_campaign=exponea-web-layer&amp;utm_medium=banner&amp;utm_source=referral" ' + uuid + ' target="_blank">Powered by Exponea</a>';
        this.addStyle('[' + uuid + ']{font-size:11px;position:absolute;color:' + color + ';opacity:.6;right:5px;bottom:5px;padding-top:0;text-decoration:none}[' + uuid + ']:hover{opacity:.9}');
    }

    /**
     * helper selecor functions
     */
    listify(list) {
        return Array.prototype.slice.call(list);
    }

    select(selector, scope = this.app) {
        var elements = this.listify(scope.querySelectorAll(selector));
        if (scope.matches(selector)) {
            elements.push(scope);
        }

        return elements;
    }
}

window.Exp = Exp;
