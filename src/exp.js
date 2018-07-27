import $anim from './helpers/anim.js'
import $validateEmail from './helpers/validateEmail.js';
import getScript from './helpers/getScript.js';

/* Main class */
class Exp {
    constructor(settings) {
        /* Initializing model */
        this.model = settings.data || {};

        this.RavenInstance = undefined;
        const RAVEN_CDN = 'https://cdn.ravenjs.com/3.24.2/raven.min.js';
        
        /* Prepare sentry config */
        this.sentry = (_ => {
            /* Default config */
            let config = {
                use: false,
                noConflict: true,
                project: '',
                options: {}
            };
            if (settings.sentry === undefined) {
                return config;
            }

            /* Change default config values */
            if (settings.sentry.use !== undefined) config.use = settings.sentry.use;
            if (settings.sentry.noConflict !== undefined) config.noConflict = settings.sentry.noConflict;
            if (settings.sentry.project !== undefined) config.project = settings.sentry.project;
            if (settings.sentry.options !== undefined) config.options = settings.sentry.options;

            return config;
        })();
        
        /* Add sentry script if necessary */
        if (this.sentry.use && typeof(Raven) === "undefined") { // Sentry SDK not present
            /* jQuery getScript polyfill */
            getScript(RAVEN_CDN, _ => {
                /* Configure sentry */
                this.configureRaven(this.sentry.noConflict);

                /* Initialize banner in sentry context */
                this.RavenInstance.context(function() {
                    this.initialize(settings);
                }.bind(this))
            })
        } else if (this.sentry.use) { // Sentry SDK already present
            /* Configure sentry */
            this.configureRaven(this.sentry.noConflict);

            /* Initialize banner in sentry context */
            this.RavenInstance.context(function() {
                this.initialize(settings);
            }.bind(this))
        } else {
            /* initialize banner without sentry */
            this.initialize(settings)
        }
        
        return this.model;
    }

    /* Initialize banner and model */
    initialize(settings) {
        /* Find DOM element which contains Exp code */
        this.el = settings.el || null;
        /* Find DOM element to which append HTML code */
        this.insert = settings.insert || null;
        
        /* Initializing data model */
        this.data = settings.data || {};
        /* Controller methods */
        this.methods = settings.methods || {};
        /* Formatters */
        this.formatters = settings.formatters || {};

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
        this.branded = (_ => {
            if (settings.branded === undefined) return false;
            if (settings.branded !== "black" && settings.branded !== "white") return false;
            else return settings.branded
        })();

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
                if (settings.context.sdk !== undefined) {
                    /* Try to add project token to sentry context */
                    if (this.sentry.use && settings.context.sdk._) {
                        this.RavenInstance.setTagsContext({ project_token: settings.context.sdk._[0][1][0].token });
                    }
                    return settings.context.sdk;
                }
                if (settings.sdk !== undefined) {
                    if (this.sentry.use && settings.sdk._) {
                        this.RavenInstance.setTagsContext({ project_token: settings.sdk._[0][1][0].token });
                    }
                    return settings.sdk;
                }
            }

            return null;
        })();
        /* Exponea banner context */
        this.context = (_ => {
            if (settings.context !== undefined) {
                if (settings.context.data !== undefined) {
                    /* Try to add banner_id and banner_name to sentry context */
                    if (this.sentry.use && settings.context.data.banner_id && settings.context.data.banner_name) {
                        this.RavenInstance.setTagsContext({ banner_id: settings.context.data.banner_id, banner_name: settings.context.data.banner_name });
                    }
                    return settings.context.data;
                }
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
                if(document.readyState == 'complete'){
                    setTimeout(() => {
                        self.inject();
                    }, delay);
                } else {
                    window.addEventListener('load', function() {
                        setTimeout(() => {
                            self.inject();
                        }, delay);
                    });
                }
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
                    const callback = function() {
                        setTimeout(() => {
                            self.inject(self);
                        }, delay);
                        self.trigger.element.removeEventListener(action, callback, false)
                    }
                    this.trigger.element.addEventListener(action, callback);
                }
                return;
            } else {
                /* If incorrect type of trigger is given do not render at all */
                throw `Incorrect trigger type ${ this.trigger.type }`;
            }
        }

        return this.inject();
    }

    /* Configure Raven SDK */
    configureRaven(noConflict) {
        if (noConflict) {
            /* Create new Raven instance, good for isolating the context between web-layers */
            this.RavenInstance = Raven.noConflict();
            this.RavenInstance.config(this.sentry.project, this.sentry.options).install();
            
            /* Try to extrack users exponea cookie, instance specific */
            if (this.RavenInstance.isSetup()) {
                var exp_cookie = false;
                document.cookie.split(/\s*;\s*/).forEach(function(val) {var [k,v]=val.split(/=/);if(k=='__exponea_etc__') exp_cookie = decodeURIComponent(v);});
                if (exp_cookie) {
                    this.RavenInstance.setUserContext( { exponea_cookie: exp_cookie } );
                };
            }
        } else {
            this.RavenInstance = Raven;
        }
    }

    /* Method for injecting the banner into DOM */
    inject() {
        /* For control group do not inject and only track show */
        if (false) { /* TODO: How to check control_group from context */
            this.loaded();
        }

        /* Render Exp banner */
        this.render();

        /* Initialize model */
        this.initializeModel(this.data);

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
        if (this.branded) this.addBranding();
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
                    self.updateHtml(key, value);
                    self.updateModels(key, value);
                    self.updateIfs(key, value);
                    self.updateAttributes(key, value);
                    self.updateIfsMethods();
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

        /* Bind helper methods */
        this.model.$anim = $anim;
        this.model.$validateEmail = $validateEmail;

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
            if (this.insert !== null) {
                this.app = document.querySelector(this.insert).appendChild(el.firstChild);
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
                let style = this.addStyle(this.style, true);
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
                        let conditionText;
                        if (!rule.conditionText) {
                            conditionText = '';
                            let condTxtArr = Object.keys(rule.media).map(function (objectKey, index) {
                                return rule.media[objectKey];
                            });
                            conditionText = condTxtArr.join(', ');
                        } else {
                            conditionText = rule.conditionText;
                        }
                        scopedStyle = scopedStyle + `@media ${conditionText} {`;
                        this.listify(rule.cssRules).forEach(rule => {
                            scopedStyle = scopedStyle + this.generateScopedRule(rule);
                        });
                        scopedStyle = scopedStyle + `}`;
                    }
                });
                /* Remove original style */
                style.parentNode.removeChild(style);
                /* Append scoped style */
                this.addStyle(scopedStyle);
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
        let supportedEvents = ["click", "submit", "input", "hover", "blur", "focus", "mouseenter", "mouseleave", "action"];
        let selector = supportedEvents.map(event => {
            return `*[exp-${event}]`;
        });
        var events = this.select(selector.join(), template);
        events.forEach(el => {
            supportedEvents.forEach(event => {
                var method = el.getAttribute('exp-' + event);
                /* If exp-action is declared then add appropriate EventListener */
                if (event == 'action') {
                    el.addEventListener('click', function(e) {
                        if (this.tracking && this.sdk !== null && this.context !== null) {
                            this.sdk.track('banner', this.getEventProperties('click'));
                        }
                    });
                }

                if (method === null || !(method in self.methods)) return;
                el.addEventListener(event, function(e) {
                    self.methods[method].apply(self.model, [e]);
                });
            });
        });
    }

    /* Binds DOM object attribute values with model */
    bindAttributes() {
        const self = this;
        const supportedAttributes = ["src", "href", "alt", "title", "disabled"];
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
                if (typeof(this.model[attr]) == "function") {
                    el.style.display = this.model[attr].call(this.model) ? "block" : "none";
                } else {
                    el.style.display = this.model[attr] ? "block" : "none";
                }
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
            /* Delete exp-for attribute */
            template.removeAttribute("exp-for");
            /* Copy template into storage, with the root element */
            let expForInstance = {
                template: template,
                parentElement: expFor.parentNode,
                siblingElement: expFor.nextElementSibling
            };
            if (arrayName in this.__storage.loopDefinitions) {
                /* Set siblingElement only if it exists and doesn't have exp-for */
                const sibling = (expFor.nextElementSibling !== null && expFor.nextElementSibling.getAttribute('exp-for') !== null) ? null : expFor.nextElementSibling;
                expForInstance.siblingElement = sibling;
                this.__storage.loopDefinitions[arrayName].push(expForInstance);
            } else {
                /* Set siblingElement only if it exists and doesn't have exp-for */
                const sibling = (expFor.nextElementSibling !== null && expFor.nextElementSibling.getAttribute('exp-for') !== null) ? null : expFor.nextElementSibling;
                expForInstance.siblingElement = sibling;
                this.__storage.loopDefinitions[arrayName] = [expForInstance];
            };
            /* Remove all children elements */
            expFor.remove();
            /* Check if array exists in model and render multiple templates */
            if (this.model[arrayName]) {
                this.model[arrayName].forEach(item => {
                    this.renderNewElement(arrayName, key, item, expForInstance);
                });
            } else {
                this.model[arrayName] = [];
            }
            /* Override the push method of array in the model for reactivity */
            this.overridePush(this.model[arrayName], arrayName, key);
        });
    }

    /* Execute formatters on exp-bind */
    writeBindValue(value, el) {
        const parsedAttributes = el.getAttribute('exp-bind').split('|');
        
        /* Has formatters */
        if (parsedAttributes.length > 1) {
            /* Store intermediate value between each formatter execution */
            let intermediateValue = value;

            /* Execute each formatter */
            for (let i = 1; i < parsedAttributes.length; i++) {
                /* Get formatter name */
                const formatter = parsedAttributes[i].trim();
                
                if (formatter in this.formatters) {
                    /* Update intermediate value */
                    intermediateValue = this.formatters[formatter].call(this.model, intermediateValue);
                }
            }

            /* Set value */
            el.textContent = intermediateValue;
        } else {
            /* Set value */
            el.textContent = value;
        }
    }

    /* Method for updating all exp-binds */
    updateBindings(key, value, el = null) {
        const bindings = this.select(`*[exp-bind^="${key}"]`);
        bindings.forEach(el => {
            this.writeBindValue(value, el);
        });
    }
    
    /* Method for updating all exp-html */
    updateHtml(key, value) {
        const htmls = this.select(`*[exp-html^="${key}"]`);
        htmls.forEach(el => {
            el.innerHTML = value;
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

    /* Method for updating exp-ifs methods */
    updateIfsMethods() {
        const expIfs = this.select(`*[exp-if]`);
        expIfs.forEach(el => {
            const key = el.getAttribute('exp-if');
            if (typeof(this.model[key]) === "function") {
                /* BUG: does not check the original display value, assumes block */
                el.style.display = this.model[key].call(this.model) ? "block" : "none";
            }
        });
    }

    /* Method for updating attributes */
    updateAttributes(key, value) {
        const supportedAttributes = ["src", "href", "alt", "title", "disabled"];
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
    renderNewElement(arrayName, key, item, expFor = null) {
        const supportedAttributes = ["src", "href", "alt"];
        var expFors;
        if (expFor !== null) {
            expFors = [expFor];
        } else {
            expFors = this.__storage.loopDefinitions[arrayName];
        }
        /* Iterate through all exp-for instances linked to targeted array */
        for (let expForInstance of expFors) {
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
                    this.writeBindValue(item, el);
                } else {
                    const keys = val.split('.');
                    var value = this.findLastField(keys.slice(1), item);
                    el.textContent = value
                }
            });
            /* Append all children of the newly populated template */
            expForInstance.parentElement.insertBefore(template, expForInstance.siblingElement);
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
        branding.setAttribute(`e${uuid}`, '')
        this.addStyle(`[e${uuid}]{font-size:11px;position:absolute;opacity:.6;right:5px;bottom:5px;padding-top:0;text-decoration:none;display:block}[e${uuid}]:hover{opacity:.9}[e${uuid}] a{color: ${this.branded}}`);
        branding.innerHTML = '<a href="https://exponea.com/?utm_campaign=exponea-web-layer&amp;utm_medium=banner&amp;utm_source=referral" target="_blank">Powered by Exponea</a>';
        this.app.appendChild(branding);
    }

    /* Adds exponea-animate class which is responsible for smooth transitions */
    addAnimationClass(className = "exponea-animate") {
        if (this.app === null) return;
        if (this.app.classList) {
            this.app.setAttribute(this.bannerId, '');
            setTimeout(function() {
                this.app.classList.add(className);
            }.bind(this));
        } else {
            setTimeout(function() {
                this.app.className += ' ' + className;
            }.bind(this));
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
