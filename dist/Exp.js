<<<<<<< HEAD
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
<<<<<<< HEAD
})({6:[function(require,module,exports) {
=======
})({4:[function(require,module,exports) {
<<<<<<< HEAD
>>>>>>> Add first version of documentation and filters
=======
/**
 * Fetches and inserts a script into the page before the first
 * pre-existing script element, and optionally calls a callback
 * on completion.
 *
 * [TODO] Make this a module of its own so it can be used elsewhere.
 * 
 * @param  {String}   src      source of the script
 * @param  {Function} callback (optional) onload callback
 */
var getScript = function getScript(src, callback) {
    var el = document.createElement('script');

    el.type = 'text/javascript';
    el.async = false;
    el.src = src;

    /**
     * Ensures callbacks work on older browsers by continuously
     * checking the readyState of the request. This is defined once
     * and reused on subsequent calls to getScript.
     * 
     * @param  {Element}   el      script element
     * @param  {Function} callback onload callback
     */
    getScript.ieCallback = getScript.ieCallback || function (el, callback) {
        if (el.readyState === 'loaded' || el.readyState === 'complete') {
            callback();
        } else {
            setTimeout(function () {
                getScript.ieCallback(el, callback);
            }, 100);
        }
    };

    if (typeof callback === 'function') {
        if (typeof el.addEventListener !== 'undefined') {
            el.addEventListener('load', callback, false);
        } else {
            el.onreadystatechange = function () {
                el.onreadystatechange = null;
                getScript.ieCallback(el, callback);
            };
        }
    }

    // This is defined once and reused on subsequeent calls to getScript
    getScript.firstScriptEl = getScript.firstScriptEl || document.getElementsByTagName('script')[0];
    getScript.firstScriptEl.parentNode.insertBefore(el, getScript.firstScriptEl);
};

module.exports = getScript;
},{}],5:[function(require,module,exports) {
>>>>>>> Add sentry integration and add more stuff to documentation
/** Copyright 2013 mocking@gmail.com * http://github.com/relay-zz/anim

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

var anim = function (_A) {
  "use strict";

  _A = function A(n, g, t, e) {
    var a,
        o,
        c,
        q = [],
        cb = function cb(i) {
      //our internal callback function maintains a queue of objects 
      //that contain callback info. If the object is an array of length
      //over 2, then it is parameters for the next animation. If the object
      //is an array of length 1 and the item in the array is a number,
      //then it is a timeout period, otherwise it is a callback function.
      if (i = q.shift()) i[1] ? _A.apply(this, i).anim(cb) : i[0] > 0 ? setTimeout(cb, i[0] * 1000) : (i[0](), cb());
    };

    if (n.charAt) n = document.getElementById(n);

    //if the 1st param is a number then treat it as a timeout period.
    //If the node reference is null, then we skip it and run the next callback
    //so that we can continue with the animation without throwing an error.
<<<<<<< HEAD
    if (n > 0 || !n) g = {}, t = 0, cb(q = [[n || 0]]);
=======
    if (n > 0 || !n) g = {}, t = 0, cb(q = [].push([n || 0]));
>>>>>>> Add first version of documentation and filters

    //firefox don't allow reading shorthand CSS styles like "margin" so
    //we have to expand them to be "margin-left", "margin-top", etc.
    //Also, expanding them allows the 4 values to animate independently 
    //in the case that the 4 values are different to begin with.
    expand(g, { padding: 0, margin: 0, border: "Width" }, [T, R, B, L]);
    expand(g, { borderRadius: "Radius" }, [T + L, T + R, B + R, B + L]);

    //if we animate a property of a node, we set a unique number on the
    //node, so that if we run another animation concurrently, it will halt
    //the first animation. This is needed so that if we animate on mouseover
    //and want to reverse the animation on mouseout before the mouseover
    //is complete, they won't clash and the last animation prevails.
    ++mutex;

    for (a in g) {
      o = g[a];
      if (!o.to && o.to !== 0) o = g[a] = { to: o }; //shorthand {margin:0} => {margin:{to:0}}

      _A.defs(o, n, a, e); //set defaults, get initial values, selects animation fx
    }

    _A.iter(g, t * 1000, cb);

    return {
      //this allows us to queue multiple animations together in compact syntax
      anim: function anim() {
        q.push([].slice.call(arguments));
        return this;
      }
    };
  };

  var T = "Top",
      R = "Right",
      B = "Bottom",
      L = "Left",
      mutex = 1,


  //{border:1} => {borderTop:1, borderRight:1, borderBottom:1, borderLeft:1}
  expand = function expand(g, dim, dir, a, i, d, o) {
    for (a in g) {
      //for each animation property
      if (a in dim) {
        o = g[a];
        for (i = 0; d = dir[i]; i++) {
          //for each dimension (Top, Right, etc.)
          //margin => marginTop
          //borderWidth => borderTopWidth
          //borderRadius => borderTopRadius
          g[a.replace(dim[a], "") + d + (dim[a] || "")] = {
            to: o.to === 0 ? o.to : o.to || o, fr: o.fr, e: o.e
          };
        }delete g[a];
      }
    }
  },
      timeout = function (w, a) {
    return w["r" + a] || w["webkitR" + a] || w["mozR" + a] || w["msR" + a] || w["oR" + a];
  }(window, "equestAnimationFrame");

  _A.defs = function (o, n, a, e, s) {
    s = n.style;
    o.a = a; //attribute
    o.n = n; //node
    o.s = a in s ? s : n; //= n.style || n
    o.e = o.e || e; //easing

    o.fr = o.fr || (o.fr === 0 ? 0 : o.s == n ? n[a] : (window.getComputedStyle ? getComputedStyle(n, null) : n.currentStyle)[a]);

    o.u = (/\d(\D+)$/.exec(o.to) || /\d(\D+)$/.exec(o.fr) || [0, 0])[1]; //units (px, %)

    //which animation fx to use. Only color needs special treatment.
    o.fn = /color/i.test(a) ? _A.fx.color : _A.fx[a] || _A.fx._;

    //the mutex is composed of the animating property name and a unique number
    o.mx = "anim_" + a;
    n[o.mx] = o.mxv = mutex;
    if (n[o.mx] != o.mxv) o.mxv = null; //test expando
  };

  _A.iter = function (g, t, cb) {
    var _,
        i,
        o,
        p,
        e,
        z = +new Date() + t,
        _ = function _() {
      i = z - new Date().getTime();

      if (i < 50) {
        for (o in g) {
          o = g[o], o.p = 1, o.fn(o, o.n, o.to, o.fr, o.a, o.e);
        }cb && cb();
      } else {

        i = i / t;

        for (o in g) {
          o = g[o];

          if (o.n[o.mx] != o.mxv) return; //if mutex not match then halt.

          e = o.e;
          p = i;

          if (e == "lin") {
            p = 1 - p;
          } else if (e == "ease") {
            p = (0.5 - p) * 2;
            p = 1 - (p * p * p - p * 3 + 2) / 4;
          } else if (e == "ease-in") {
            p = 1 - p;
            p = p * p * p;
          } else {
            //ease-out
            p = 1 - p * p * p;
          }
          o.p = p;
          o.fn(o, o.n, o.to, o.fr, o.a, o.e);
        }
        timeout ? timeout(_) : setTimeout(_, 20);
      }
    };
    _();
  };

  _A.fx = { //CSS names which need special handling

    _: function _(o, n, to, fr, a, e) {
      //for generic fx
      fr = parseFloat(fr) || 0, to = parseFloat(to) || 0, o.s[a] = (o.p >= 1 ? to : o.p * (to - fr) + fr) + o.u;
    },

    width: function width(o, n, to, fr, a, e) {
      //for width/height fx
      if (!(o._fr >= 0)) o._fr = !isNaN(fr = parseFloat(fr)) ? fr : a == "width" ? n.clientWidth : n.clientHeight;
      _A.fx._(o, n, to, o._fr, a, e);
    },

    opacity: function opacity(o, n, to, fr, a, e) {
      if (isNaN(fr = fr || o._fr)) fr = n.style, fr.zoom = 1, fr = o._fr = (/alpha\(opacity=(\d+)\b/i.exec(fr.filter) || {})[1] / 100 || 1;
      fr *= 1;
      to = o.p * (to - fr) + fr;
      n = n.style;
      if (a in n) {
        n[a] = to;
      } else {
        n.filter = to >= 1 ? "" : "alpha(" + a + "=" + Math.round(to * 100) + ")";
      }
    },

    color: function color(o, n, to, fr, a, e, i, v) {
      if (!o.ok) {
        to = o.to = _A.toRGBA(to);
        fr = o.fr = _A.toRGBA(fr);
        if (to[3] == 0) to = [].concat(fr), to[3] = 0;
        if (fr[3] == 0) fr = [].concat(to), fr[3] = 0;
        o.ok = 1;
      }

      v = [0, 0, 0, o.p * (to[3] - fr[3]) + 1 * fr[3]];
      for (i = 2; i >= 0; i--) {
        v[i] = Math.round(o.p * (to[i] - fr[i]) + 1 * fr[i]);
      }if (v[3] >= 1 || _A.rgbaIE) v.pop();

      try {
        o.s[a] = (v.length > 3 ? "rgba(" : "rgb(") + v.join(",") + ")";
      } catch (e) {
        _A.rgbaIE = 1;
      }
    }
  };
  _A.fx.height = _A.fx.width;

  _A.RGBA = /#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/;
  _A.toRGBA = function (s, v) {
    v = [0, 0, 0, 0];
    s.replace(/\s/g, "").replace(_A.RGBA, function (i, a, b, c, f, g, h, l, m, n, o, w, x, y, z) {
      var h = [a + a || f, b + b || g, c + c || h],
          p = [l, m, n];

      for (i = 0; i < 3; i++) {
        h[i] = parseInt(h[i], 16), p[i] = Math.round(p[i] * 2.55);
      }v = [h[0] || p[0] || w || 0, h[1] || p[1] || x || 0, h[2] || p[2] || y || 0, o || z || 1];
    });
    return v;
  };

  return _A;
}();

module.exports = anim;
<<<<<<< HEAD
<<<<<<< HEAD
},{}],7:[function(require,module,exports) {
=======
},{}],5:[function(require,module,exports) {
>>>>>>> Add first version of documentation and filters
=======
},{}],6:[function(require,module,exports) {
>>>>>>> Add sentry integration and add more stuff to documentation
/**
 * 
 * @param {string} email 
 * @returns {bool}
 */
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = validateEmail;
<<<<<<< HEAD
},{}],4:[function(require,module,exports) {
=======
},{}],2:[function(require,module,exports) {
<<<<<<< HEAD
>>>>>>> Add first version of documentation and filters
=======
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

>>>>>>> Add sentry integration and add more stuff to documentation
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Main class */
var Exp = function () {
    function Exp(settings) {
        var _this = this;

        _classCallCheck(this, Exp);

<<<<<<< HEAD
        /* Find DOM element which contains Exp code */
        this.el = settings.el || null;
        /* Find DOM element to which append HTML code */
        this.attach = settings.attach || null;

        /* Initializing data model */
        this.data = settings.data || {};
        /* Controller methods */
        this.methods = settings.methods || {};
<<<<<<< HEAD
=======
        /* Filters */
        this.filters = settings.filters || {};
>>>>>>> Add first version of documentation and filters
=======
>>>>>>> Add sentry integration and add more stuff to documentation
        /* Initializing model */
        this.model = settings.data || {};

        this.RavenInstance = undefined;
        this.RAVEN_PROJECT = 'https://0a9f9e0203be4cff88075453bfdcce3b@sentry.exponea.com/12';
        this.RAVEN_CDN = 'https://cdn.ravenjs.com/3.24.2/raven.min.js';

        this.sentry = function (_) {
            var defaultSentryConfig = { use: false, noConflict: true };
            if (settings.sentry === undefined) {
                return defaultSentryConfig;
            } else {
                /* check if provided config is valid */
                var valid = settings.sentry.use !== undefined && settings.sentry.noConflict !== undefined;
                if (valid) {
                    return settings.sentry;
                } else {
                    return defaultSentryConfig;
                }
            }
        }();

        if (this.sentry.use && typeof Raven === "undefined") {
            var getScript = require('./helpers/getScript.js');
            getScript(this.RAVEN_CDN, function (_) {
                _this.configureRaven(_this.sentry.noConflict);

                _this.RavenInstance.context(function () {
                    this.initialize(settings);
                }.bind(_this));
            });
        } else if (this.sentry.use) {
            this.configureRaven(this.sentry.noConflict);
            this.initialize(settings);
        } else {
            this.initialize(settings);
        }

        /* If no trigger type inject normally */
        return this.model;
    }

    _createClass(Exp, [{
        key: 'initialize',
        value: function initialize(settings) {
            var _this2 = this;

            /* Find DOM element which contains Exp code */
            this.el = settings.el || null;
            /* Find DOM element to which append HTML code */
            this.attach = settings.attach || null;

            /* Initializing data model */
            this.data = settings.data || {};
            /* Controller methods */
            this.methods = settings.methods || {};
            /* Filters */
            this.filters = settings.filters || {};

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
            if (settings.branded === undefined || settings.branded === null || settings.branded && settings.branded !== "black" && settings.branded !== "white") {
                this.branded = "black";
            } else {
                this.branded = settings.branded;
            }

            /* Look for either explicit code or for HTML code in context */
            this.html = function (_) {
                if (settings.html !== undefined) return settings.html;
                if (settings.context !== undefined) {
                    if (settings.context.html !== undefined) return settings.context.html;
                }
                return null;
            }();
            /* Look for either explicit code or for CSS code in context */
            this.style = function (_) {
                if (settings.style !== undefined) return settings.style;
                if (settings.context !== undefined) {
                    if (settings.context.style !== undefined) return settings.context.style;
                }
                return null;
            }();
            /* Exponea SDK passed through context attribute when using production banners */
            this.sdk = function (_) {
                if (settings.context !== undefined) {
                    if (settings.context.sdk !== undefined) {
                        if (settings.context.sdk._) {
                            _this2.RavenInstance.setTagsContext({ project_token: settings.context.sdk._[0][1][0].token });
                        }
                        return settings.context.sdk;
                    }
                }

                return null;
            }();
            /* Exponea banner context */
            this.context = function (_) {
                if (settings.context !== undefined) {
                    if (settings.context.data !== undefined) {
                        if (settings.context.data.banner_id && settings.context.data.banner_name) {
                            _this2.RavenInstance.setTagsContext({ banner_id: settings.context.data.banner_id, banner_name: settings.context.data.banner_name });
                        }
                        return settings.context.data;
                    }
                }

                return null;
            }();

            /* Check whether banner is in Exponea editor or not */
            this.inPreview = function (_) {
                if (settings.context !== undefined) {
                    if (settings.context.inPreview !== undefined) return settings.context.inPreview;
                }

                return false;
            }();

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
                    var delay = this.trigger.delay || 0;
                    var self = this;
                    window.addEventListener('load', function () {
                        setTimeout(function () {
                            self.inject();
                        }, delay);
                    });
                    return;
                } else if (this.trigger.type == "onexit") {
                    /* Renders banner if user wants to leave the page */
                    var _delay = this.trigger.delay || 0;
                    window.__exp_triggered = false;
                    var self = this;
                    document.body.addEventListener("mouseleave", function (e) {
                        /* Check window was left */
                        if (e.offsetY - window.scrollY < 0 && !window.__exp_triggered) {
                            window.__exp_triggered = true;
                            setTimeout(function () {
                                self.inject(self);
                            }, _delay);
                        }
                    });
                    return;
                } else if (this.trigger.type = "onaction") {
                    /* Renders banner on specific user action */
                    var self = this;
                    var action = this.trigger.action || "click";
                    var _delay2 = this.trigger.delay || 0;
                    if (this.trigger.element) {
                        var callback = function callback() {
                            setTimeout(function () {
                                self.inject(self);
                            }, _delay2);
                            self.trigger.element.removeEventListener(action, callback, false);
                        };
                        this.trigger.element.addEventListener(action, callback);
                    }
                    return;
                } else {
                    /* If incorrect type of trigger is given do not render at all */
                    throw 'Incorrect trigger type ' + this.trigger.type;
                }
            }

            return this.inject();
        }
    }, {
        key: 'configureRaven',
        value: function configureRaven(noConflict) {
            if (noConflict) {
                this.RavenInstance = Raven.noConflict();
                this.RavenInstance.config(this.RAVEN_PROJECT, { tags: { instance: 'exp' } }).install();

                if (this.RavenInstance.isSetup()) {
                    var exp_cookie = false;
                    document.cookie.split(/\s*;\s*/).forEach(function (val) {
                        var _val$split = val.split(/=/),
                            _val$split2 = _slicedToArray(_val$split, 2),
                            k = _val$split2[0],
                            v = _val$split2[1];

                        if (k == '__exponea_etc__') exp_cookie = decodeURIComponent(v);
                    });
                    if (exp_cookie) {
                        this.RavenInstance.setUserContext({ exponea_cookie: exp_cookie });
                    };
                }
            } else {
                this.RavenInstance = Raven;
            }
        }

        /* Method for injecting the banner into DOM */

    }, {
        key: 'inject',
        value: function inject() {
            /* For control group do not inject and only track show */
            if (false) {
                /* TODO: How to check control_group from context */
                this.loaded();
            }

<<<<<<< HEAD
            /* Initialize model */
            this.initializeModel(this.data);

            /* Render Exp banner */
            this.render();

=======
            /* Render Exp banner */
            this.render();

            /* Initialize model */
            this.initializeModel(this.data);

>>>>>>> Add first version of documentation and filters
            /* Create the main tunnel of bindings between HTML with JS */
            this.bindModels();
            this.bindMethods();
            this.bindAttributes();
            this.bindClose();
            this.bindFors();
            this.bindIfs();

            /* Load recommendations */
            this.loadRecommendations();

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

    }, {
        key: 'initializeModel',
        value: function initializeModel(data) {
            var self = this;
            Object.keys(data).forEach(function (key) {
                var value = data[key];
                /* Define new setters to update model on change */
                Object.defineProperty(self.model, key, {
                    enumerable: true,
                    get: function get() {
                        return value;
                    },
                    set: function set(val) {
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
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(this.methods)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        this.model[key] = this.methods[key];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }

            /* Bind helper methods */
            this.model.$anim = require('./helpers/anim.js');
            this.model.$validateEmail = require('./helpers/validateEmail.js');

            /* Bind special methods to be used in `this` scope */
            this.model.removeBanner = this.removeBanner.bind(this, this.app);
            this.model.sdk = this.sdk;
        }

        /* Render Exp banner by injecting it into DOM and adding style */

    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            /* Use el to find element over which to mask Exp */
            if (this.el !== null) {
                this.app = document.querySelector(this.el);
                /* Otherwise check for HTML code which would be created and injected into DOM */
            } else if (this.html !== null) {
                /* Insert HTML to page */
                var el = document.createElement('div');
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
                    var style = this.addStyle(this.style, true);
                    var rules = this.listify(style.sheet.cssRules);
                    var scopedStyle = "";
                    /* Iterate over CSS rules */
                    rules.forEach(function (rule) {
                        /* Check rule is instances of CSSStyleRule */
                        if (rule instanceof CSSStyleRule) {
                            scopedStyle = scopedStyle + _this3.generateScopedRule(rule);
                        }
                        /* Rule is media query */
                        if (rule instanceof CSSMediaRule) {
                            scopedStyle = scopedStyle + ('@media ' + rule.conditionText + ' {');
                            _this3.listify(rule.cssRules).forEach(function (rule) {
                                scopedStyle = scopedStyle + _this3.generateScopedRule(rule);
                            });
                            scopedStyle = scopedStyle + '}';
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

    }, {
        key: 'bindModels',
        value: function bindModels() {
            var _this4 = this;

            var selector = ["email", "number", "search", "tel", "text", "url", "checkbox", "radio"].map(function (input) {
                return 'input[type="' + input + '"][exp-model]';
            });
            selector = selector.concat(["textarea[exp-model]", "select[exp-model]"]);
            /* Find all input elements */
            var inputs = this.select(selector.join());
            inputs.forEach(function (input) {
                var model = input.getAttribute("exp-model");
                var type = input.getAttribute("type");
                /* Handle different input types */
                if (type === "checkbox") {
                    input.addEventListener("change", function (event) {
                        _this4.model[model] = event.target.checked;
                    });
                } else if (type === "radio") {
                    input.addEventListener("change", function (event) {
                        _this4.model[model] = event.target.value;
                    });
                } else {
                    input.addEventListener("input", function (event) {
                        _this4.model[model] = event.target.value;
                    });
                }
            });
        }

        /* Initial bindings of methods */

    }, {
        key: 'bindMethods',
        value: function bindMethods() {
            var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            var self = this;
<<<<<<< HEAD
            var supportedEvents = ["click", "submit", "input", "hover", "blur", "focus", "mouseenter", "mouseleave"];
=======
            var supportedEvents = ["click", "submit", "input", "hover", "blur", "focus", "mouseenter", "mouseleave", "action"];
>>>>>>> Add first version of documentation and filters
            var selector = supportedEvents.map(function (event) {
                return '*[exp-' + event + ']';
            });
            var events = this.select(selector.join(), template);
            events.forEach(function (el) {
                supportedEvents.forEach(function (event) {
                    var method = el.getAttribute('exp-' + event);
<<<<<<< HEAD
                    if (method === null || !(method in self.methods)) return;
                    /* If exp-action is declared then add appropriate EventListener */
=======
                    /* If exp-action is declared then add appropriate EventListener */
                    if (event == 'action') {
                        el.addEventListener('click', function (e) {
                            if (this.tracking && this.sdk !== null && this.context !== null) {
                                this.sdk.track('banner', this.getEventProperties('click'));
                            }
                        });
                    }

                    if (method === null || !(method in self.methods)) return;
>>>>>>> Add first version of documentation and filters
                    el.addEventListener(event, function (e) {
                        self.methods[method].apply(self.model, [e]);
                    });
                });
            });
        }

        /* Binds DOM object attribute values with model */

    }, {
        key: 'bindAttributes',
        value: function bindAttributes() {
            var self = this;
<<<<<<< HEAD
            var supportedAttributes = ["src", "href", "alt"];
=======
            var supportedAttributes = ["src", "href", "alt", "title", "disabled"];
>>>>>>> Add first version of documentation and filters
            var selector = supportedAttributes.map(function (attr) {
                return '*[exp-' + attr + ']';
            });
            var elements = this.select(selector.join());
            elements.forEach(function (el) {
                supportedAttributes.forEach(function (attr) {
                    var val = el.getAttribute('exp-' + attr);
                    if (val === null || !(val in self.model)) return;
                    /* Update value according to data in model */
                    el.setAttribute(attr, self.model[val]);
                });
            });
        }

        /* Binds the close button with tracking and deleting functionality */

    }, {
        key: 'bindClose',
        value: function bindClose() {
            var _this5 = this;

            var selector = '[exp-close]';
            var elements = this.select(selector);
            elements.forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _this5.removeBanner();
                    /* Track 'close' if tracking is set to true */
                    if (_this5.tracking && _this5.sdk !== null && _this5.context !== null) {
                        _this5.sdk.track('banner', _this5.getEventProperties('close'));
                    }
                });
            });
        }

        /* Bind exp-ifs */

    }, {
        key: 'bindIfs',
        value: function bindIfs() {
            var _this6 = this;

            var expIfs = this.select('[exp-if]');
            expIfs.forEach(function (el) {
                /* BUG: does not check the original display value, assumes block */
                var attr = el.getAttribute("exp-if");
                if (_this6.model[attr] !== null && _this6.model[attr] !== undefined) {
                    el.style.display = _this6.model[attr] ? "block" : "none";
                } else {
                    throw 'exp-if attribute ' + attr + ' is not defined in model.';
                    _this6.model[attr] = null;
                }
            });
        }

        /* Creates access to elements from model scope */

    }, {
        key: 'bindRefs',
        value: function bindRefs() {
            var _this7 = this;

            var selecor = '[exp-ref]';
            var elements = this.select(selecor);
            elements.forEach(function (el) {
                var val = el.getAttribute('exp-ref');
                if (val && val !== '') {
                    _this7.model.$refs[val] = el;
                }
            });
        }

        /* Instantiates and binds exp-for with model */

    }, {
        key: 'bindFors',
        value: function bindFors() {
            var _this8 = this;

            var expFors = this.select('[exp-for], [exp-rcm]');
            expFors.forEach(function (expFor) {
                /* Tokenize and parse attribute */
                var attr = expFor.hasAttribute('exp-for') ? 'exp-for' : 'exp-rcm';
                var key = expFor.getAttribute(attr).split(' ')[0];
                var arrayName = expFor.getAttribute(attr).split(' ')[2];
                var hash = 'e-' + _this8.getUuid();
                var template = expFor.cloneNode(true);
                /* Delete exp-for attribute */
                template.removeAttribute("exp-for");
                /* Copy template into storage, with the root element */
<<<<<<< HEAD
<<<<<<< HEAD
                var expForInstance = {
                    template: template,
                    parentElement: expFor.parentNode,
                    siblingElement: expFor.nextElementSibling
                };
                if (arrayName in _this6.__storage.loopDefinitions) {
                    _this6.__storage.loopDefinitions[arrayName].push(expForInstance);
                } else {
                    _this6.__storage.loopDefinitions[arrayName] = [expForInstance];
=======
                if (arrayName in _this6.__storage.loopDefinitions) {
=======
                if (arrayName in _this8.__storage.loopDefinitions) {
>>>>>>> Add sentry integration and add more stuff to documentation
                    var sibling = expFor.nextElementSibling !== null && expFor.nextElementSibling.getAttribute('exp-for') !== null ? null : expFor.nextElementSibling;
                    _this8.__storage.loopDefinitions[arrayName].push({
                        template: template,
                        parentElement: expFor.parentNode,
                        siblingElement: sibling
                    });
                } else {
                    var _sibling = expFor.nextElementSibling !== null && expFor.nextElementSibling.getAttribute('exp-for') !== null ? null : expFor.nextElementSibling;
                    _this8.__storage.loopDefinitions[arrayName] = [{
                        template: template,
                        parentElement: expFor.parentNode,
                        siblingElement: _sibling
                    }];
>>>>>>> Add first version of documentation and filters
                };
                /* Remove all children elements */
                expFor.remove();
                /* Check if array exists in model and render multiple templates */
<<<<<<< HEAD
                if (_this6.model[arrayName]) {
                    _this6.model[arrayName].forEach(function (item) {
<<<<<<< HEAD
                        _this6.renderNewElement(arrayName, key, item, expForInstance);
=======
                        _this6.renderNewElement(arrayName, key, item);
>>>>>>> Add first version of documentation and filters
=======
                if (_this8.model[arrayName]) {
                    _this8.model[arrayName].forEach(function (item) {
                        _this8.renderNewElement(arrayName, key, item);
>>>>>>> Add sentry integration and add more stuff to documentation
                    });
                } else {
                    _this8.model[arrayName] = [];
                }
                /* Override the push method of array in the model for reactivity */
                _this8.overridePush(_this8.model[arrayName], arrayName, key);
            });
        }
<<<<<<< HEAD
=======
    }, {
        key: 'writeBindValue',
        value: function writeBindValue(value, el) {
            var parsedAttributes = el.getAttribute('exp-bind').split('|');

            if (parsedAttributes.length > 1) {
                var intermediateValue = value;

                for (var i = 1; i < parsedAttributes.length; i++) {
                    var filter = parsedAttributes[i].trim();

                    if (filter in this.filters) {
                        intermediateValue = this.filters[filter].call(this.model, intermediateValue);
                    }
                }

                el.textContent = intermediateValue;
            } else {
                el.textContent = value;
            }
        }
>>>>>>> Add first version of documentation and filters

        /* Method for updating all exp-binds */

    }, {
        key: 'updateBindings',
        value: function updateBindings(key, value) {
<<<<<<< HEAD
<<<<<<< HEAD
            var bindings = this.select("*[exp-bind=\"" + key + "\"]");
            bindings.forEach(function (el) {
                el.textContent = value;
=======
            var _this7 = this;
=======
            var _this9 = this;
>>>>>>> Add sentry integration and add more stuff to documentation

            var el = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var bindings = this.select('*[exp-bind~="' + key + '"]');
            bindings.forEach(function (el) {
<<<<<<< HEAD
                _this7.writeBindValue(value, el);
>>>>>>> Add first version of documentation and filters
=======
                _this9.writeBindValue(value, el);
>>>>>>> Add sentry integration and add more stuff to documentation
            });
        }

        /* Method for updating input exp-models */

    }, {
        key: 'updateModels',
        value: function updateModels(key, value) {
            var modelBindings = this.select('*[exp-model="' + key + '"]');
            modelBindings.forEach(function (input) {
                var model = input.getAttribute("exp-model");
                var type = input.getAttribute("type");
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

    }, {
        key: 'updateIfs',
        value: function updateIfs(key, value) {
            var expIfs = this.select('*[exp-if="' + key + '"]');
            expIfs.forEach(function (el) {
                /* BUG: does not check the original display value, assumes block */
                el.style.display = value ? "block" : "none";
            });
        }

        /* Method for updating attributes */

    }, {
        key: 'updateAttributes',
        value: function updateAttributes(key, value) {
<<<<<<< HEAD
            var supportedAttributes = ["src", "href", "alt"];
=======
            var supportedAttributes = ["src", "href", "alt", "title", "disabled"];
>>>>>>> Add first version of documentation and filters
            var selector = supportedAttributes.map(function (attr) {
                return '*[exp-' + attr + '="' + key + '"]';
            });
            var that = this;
            var elements = this.select(selector.join());

            elements.forEach(function (el) {
                supportedAttributes.forEach(function (attr) {
                    var val = el.getAttribute('exp-' + attr);
                    if (val === null || !(val in that.model)) return;

                    el[attr] = that.model[val];
                });
            });
        }

        /* Renders a new element of an array */

    }, {
        key: 'renderNewElement',
        value: function renderNewElement(arrayName, key, item) {
<<<<<<< HEAD
<<<<<<< HEAD
            var _this7 = this;

            var expFor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var supportedAttributes = ["src", "href", "alt"];
            var expFors;
            if (expFor !== null) {
                expFors = [expFor];
            } else {
                expFors = this.__storage.loopDefinitions[arrayName];
            }
=======
            var _this8 = this;
=======
            var _this10 = this;
>>>>>>> Add sentry integration and add more stuff to documentation

            var supportedAttributes = ["src", "href", "alt"];
>>>>>>> Add first version of documentation and filters
            /* Iterate through all exp-for instances linked to targeted array */
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
<<<<<<< HEAD
                for (var _iterator2 = expFors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
=======
                for (var _iterator2 = this.__storage.loopDefinitions[arrayName][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
>>>>>>> Add first version of documentation and filters
                    expForInstance = _step2.value;

                    /* Clone the template and populate it with element data */
                    var template = expForInstance.template.cloneNode(true);
                    var attrSelector = supportedAttributes.map(function (attr) {
                        return '*[exp-' + attr + ']';
                    });
                    var expAttrs = this.select(attrSelector.join(), template);
                    var expBinds = this.select('[exp-bind]', template);
                    /* Override attributes of the node */
                    expAttrs.forEach(function (el) {
                        supportedAttributes.forEach(function (attr) {
                            var val = el.getAttribute('exp-' + attr);
                            if (val === null) return;
                            if (val.indexOf('.') == -1) {
                                el[attr] = item;
                            } else {
                                var keys = val.split('.');
<<<<<<< HEAD
<<<<<<< HEAD
                                var value = _this7.findLastField(keys.slice(1), item);
=======
                                var value = _this8.findLastField(keys.slice(1), item);
>>>>>>> Add first version of documentation and filters
=======
                                var value = _this10.findLastField(keys.slice(1), item);
>>>>>>> Add sentry integration and add more stuff to documentation
                                el[attr] = value;
                            };
                        });
                    });
                    /* Override inner value of the node */
                    expBinds.forEach(function (el) {
                        var val = el.getAttribute('exp-bind');
                        if (val.indexOf('.') == -1) {
<<<<<<< HEAD
<<<<<<< HEAD
                            el.textContent = item;
                        } else {
                            var keys = val.split('.');
                            var value = _this7.findLastField(keys.slice(1), item);
=======
                            _this8.writeBindValue(item, el);
                        } else {
                            var keys = val.split('.');
                            var value = _this8.findLastField(keys.slice(1), item);
>>>>>>> Add first version of documentation and filters
=======
                            _this10.writeBindValue(item, el);
                        } else {
                            var keys = val.split('.');
                            var value = _this10.findLastField(keys.slice(1), item);
>>>>>>> Add sentry integration and add more stuff to documentation
                            el.textContent = value;
                        }
                    });
                    /* Append all children of the newly populated template */
                    expForInstance.parentElement.insertBefore(template, expForInstance.siblingElement);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /* Override the push function with reactivity functionality */

    }, {
        key: 'overridePush',
        value: function overridePush(array, arrayName, key) {
            var self = this;
            array.push = function (_) {
                var original = Array.prototype.push;
                return function () {
                    var ret = original.apply(this, arguments);
                    self.renderNewElement(arrayName, key, arguments[0]);
                    return ret;
                };
            }();
        }

        /* Method for inserting stylesheet */

    }, {
        key: 'addStyle',
        value: function addStyle(css) {
            var disabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (this.app === null) return;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css)); /* BUG: Does not work in IE8 or less */
            var inserted = this.app.appendChild(style);
            inserted.sheet.disabled = disabled;
            return inserted;
        }

        /* Method for adding unique ID to CSS selectors */

    }, {
        key: 'generateScopedRule',
        value: function generateScopedRule(rule) {
<<<<<<< HEAD
<<<<<<< HEAD
            var _this8 = this;

            var selectors = rule.selectorText.split(',');
            var selectorsText = selectors.map(function (selector) {
                var attr = "exp-" + _this8.getUuid();
                _this8.addAttributes(selector.trim(), attr);
                if (selector.includes(".exponea-animate")) {
                    return selector + "[" + _this8.bannerId + "]";
                }
                if (_this8.select(selector.trim()).length > 0) {
=======
            var _this9 = this;
=======
            var _this11 = this;
>>>>>>> Add sentry integration and add more stuff to documentation

            var selectors = rule.selectorText.split(',');
            var selectorsText = selectors.map(function (selector) {
                var attr = 'exp-' + _this11.getUuid();
                _this11.addAttributes(selector.trim(), attr);
                if (selector.includes(".exponea-animate")) {
                    return selector + '[' + _this11.bannerId + ']';
                }
<<<<<<< HEAD
                if (_this9.select(selector.trim()).length > 0) {
>>>>>>> Add first version of documentation and filters
                    return selector + "[" + attr + "]";
=======
                if (_this11.select(selector.trim()).length > 0) {
                    return selector + '[' + attr + ']';
>>>>>>> Add sentry integration and add more stuff to documentation
                }
                return '' + selector;
            });
            return selectorsText.join() + ' { ' + rule.style.cssText + ' }';
        }

        /* Handle backdrop option */

    }, {
        key: 'addBackdrop',
        value: function addBackdrop() {
<<<<<<< HEAD
<<<<<<< HEAD
            var _this9 = this;
=======
            var _this10 = this;
>>>>>>> Add first version of documentation and filters
=======
            var _this12 = this;
>>>>>>> Add sentry integration and add more stuff to documentation

            if (this.app == null) return;
            /* Set default backdrop style */
            var backdropStyle = {
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100vw",
                "height": "100vh",
                "z-index": "9999",
                "background": "rgba(0,0,0,0.7)"
                /* Customize backdrop. If style=true then iterates over an empty array */
            };var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.keys(this.backdrop)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var key = _step3.value;

                    backdropStyle[key] = this.backdrop[key];
                }
                /* Inject element into DOM */
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var backdrop = document.createElement('div');
            this.setStyleFromObject(backdropStyle, backdrop);
            this.app.parentNode.style['position'] = "relative";
            this.app.style["z-index"] = "9999999";
            this.backdrop = this.app.parentNode.appendChild(backdrop);
            /* Add event listener which removes banner on click */
            this.backdrop.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
<<<<<<< HEAD
<<<<<<< HEAD
                _this9.removeBanner();
=======
                _this10.removeBanner();
>>>>>>> Add first version of documentation and filters
=======
                _this12.removeBanner();
>>>>>>> Add sentry integration and add more stuff to documentation
            });
        }

        /* Adds Powered by Exponea branding */

    }, {
        key: 'addBranding',
        value: function addBranding() {
            if (this.app === null) return;
            var branding = document.createElement('object');
            var uuid = this.getUuid();
            branding.setAttribute('e' + uuid, '');
            this.addStyle('[e' + uuid + ']{font-size:11px;position:absolute;opacity:.6;right:5px;bottom:5px;padding-top:0;text-decoration:none;display:block}[e' + uuid + ']:hover{opacity:.9}[e' + uuid + '] a{color: ' + this.branded + '}');
            branding.innerHTML = '<a href="https://exponea.com/?utm_campaign=exponea-web-layer&amp;utm_medium=banner&amp;utm_source=referral" target="_blank">Powered by Exponea</a>';
            this.app.appendChild(branding);
        }

        /* Adds exponea-animate class which is responsible for smooth transitions */

    }, {
        key: 'addAnimationClass',
        value: function addAnimationClass() {
            var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "exponea-animate";

            if (this.app === null) return;
            if (this.app.classList) {
                this.app.setAttribute(this.bannerId, '');
                this.app.classList.add(className);
            } else {
                this.app.className += ' ' + className;
            }
        }

        /* Loads Exponea recommendation and inserts into model */

    }, {
        key: 'loadRecommendations',
        value: function loadRecommendations() {
<<<<<<< HEAD
<<<<<<< HEAD
            var _this10 = this;

            Object.keys(this.recommendations).forEach(function (rcm) {
                /* Has to already exist due to exp-for initialization */
                if (_this10.model[rcm]) {
                    /* Option parameters according to Exponea JS SDK */
                    var options = {
                        recommendationId: _this10.recommendations[rcm].id,
                        size: _this10.recommendations[rcm].total,
=======
            var _this11 = this;
=======
            var _this13 = this;
>>>>>>> Add sentry integration and add more stuff to documentation

            Object.keys(this.recommendations).forEach(function (rcm) {
                /* Has to already exist due to exp-for initialization */
                if (_this13.model[rcm]) {
                    /* Option parameters according to Exponea JS SDK */
                    var options = {
<<<<<<< HEAD
                        recommendationId: _this11.recommendations[rcm].id,
                        size: _this11.recommendations[rcm].total,
>>>>>>> Add first version of documentation and filters
=======
                        recommendationId: _this13.recommendations[rcm].id,
                        size: _this13.recommendations[rcm].total,
>>>>>>> Add sentry integration and add more stuff to documentation
                        callback: function callback(data) {
                            /* Push to model */
                            if (data && data.length > 0) {
                                data.forEach(function (item) {
<<<<<<< HEAD
<<<<<<< HEAD
                                    _this10.model[rcm].push(item);
                                });
                            }
                            /* Update loading key */
                            if (_this10.recommendations[rcm].loadingKey !== undefined) {
                                _this10.model[_this10.recommendations[rcm].loadingKey] = true;
=======
                                    _this11.model[rcm].push(item);
                                });
                            }
                            /* Update loading key */
                            if (_this11.recommendations[rcm].loadingKey !== undefined) {
                                _this11.model[_this11.recommendations[rcm].loadingKey] = true;
>>>>>>> Add first version of documentation and filters
=======
                                    _this13.model[rcm].push(item);
                                });
                            }
                            /* Update loading key */
                            if (_this13.recommendations[rcm].loadingKey !== undefined) {
                                _this13.model[_this13.recommendations[rcm].loadingKey] = true;
>>>>>>> Add sentry integration and add more stuff to documentation
                            }
                        },
                        fillWithRandom: true
                    };
                    /* Generate recommendation */
<<<<<<< HEAD
<<<<<<< HEAD
                    if (_this10.sdk && _this10.sdk.getRecommendation) {
                        _this10.sdk.getRecommendation(options);
                    } else {
                        if (_this10.recommendations[rcm].loadingKey !== undefined) {
                            _this10.model[_this10.recommendations[rcm].loadingKey] = true;
=======
                    if (_this11.sdk && _this11.sdk.getRecommendation) {
                        _this11.sdk.getRecommendation(options);
                    } else {
                        if (_this11.recommendations[rcm].loadingKey !== undefined) {
                            _this11.model[_this11.recommendations[rcm].loadingKey] = true;
>>>>>>> Add first version of documentation and filters
=======
                    if (_this13.sdk && _this13.sdk.getRecommendation) {
                        _this13.sdk.getRecommendation(options);
                    } else {
                        if (_this13.recommendations[rcm].loadingKey !== undefined) {
                            _this13.model[_this13.recommendations[rcm].loadingKey] = true;
>>>>>>> Add sentry integration and add more stuff to documentation
                        }
                    }
                }
            });
        }

        /* Remove banner */

    }, {
        key: 'removeBanner',
        value: function removeBanner() {
            if (this.app === null) return;
            this.app.parentNode.removeChild(this.app);
            if (this.backdrop !== null) this.backdrop.parentNode.removeChild(this.backdrop);
        }

        /**
         * Helper functions
         */

        /* Return Array from DOM elements collection list */

    }, {
        key: 'listify',
        value: function listify(list) {
            return Array.prototype.slice.call(list);
        }
        /* Return array from querySelector */

    }, {
        key: 'select',
        value: function select(selector) {
            var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.app;

            if (scope === null) return [];
            var elements = this.listify(scope.querySelectorAll(selector));
            if (scope.matches(selector)) {
                elements.push(scope);
            }
            return elements;
        }
        /* Helper method for adding attribute, used by CSS scoping */

    }, {
        key: 'addAttributes',
        value: function addAttributes(selector, attr) {
            var val = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

            this.select(selector).forEach(function (el) {
                el.setAttribute(attr, val);
            });
        }
        /* Helper method for generating unique IDs, used by CSS scoping */

    }, {
        key: 'getUuid',
        value: function getUuid() {
            var firstPart = Math.random() * 46656 | 0;
            var secondPart = Math.random() * 46656 | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
        /* Add inline style to element */

    }, {
        key: 'setStyleFromObject',
        value: function setStyleFromObject(object, el) {
            for (var property in object) {
                el.style[property] = object[property];
            }
        }
        /* Helper method for creating event attributes for tracking */

    }, {
        key: 'getEventProperties',
        value: function getEventProperties(action, interactive) {
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

    }, {
        key: 'findLastField',
        value: function findLastField(items, dict) {
            if (items.length == 1) return dict[items[0]];else return rec(items.slice(1), dict[items[0]]);
        }
    }]);

    return Exp;
}();

window.Exp = Exp;
<<<<<<< HEAD
<<<<<<< HEAD
},{"./helpers/anim.js":6,"./helpers/validateEmail.js":7}],12:[function(require,module,exports) {
=======
},{"./helpers/anim.js":4,"./helpers/validateEmail.js":5}],6:[function(require,module,exports) {
>>>>>>> Add first version of documentation and filters
=======
},{"./helpers/getScript.js":4,"./helpers/anim.js":5,"./helpers/validateEmail.js":6}],20:[function(require,module,exports) {
>>>>>>> Add sentry integration and add more stuff to documentation

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
<<<<<<< HEAD
<<<<<<< HEAD
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '64144' + '/');
=======
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60561' + '/');
>>>>>>> Add first version of documentation and filters
=======
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '64802' + '/');
>>>>>>> Add sentry integration and add more stuff to documentation
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
<<<<<<< HEAD
<<<<<<< HEAD
},{}]},{},[12,4])
=======
},{}]},{},[6,2])
>>>>>>> Add first version of documentation and filters
=======
},{}]},{},[20,2])
>>>>>>> Add sentry integration and add more stuff to documentation
//# sourceMappingURL=/dist/Exp.map
=======
require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var s=e[n]=new t.Module(n);r[n][0].call(s.exports,i,s,s.exports)}return e[n].exports}function o(r){this.id=r,this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.isParcelRequire=!0,t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({3:[function(require,module,exports) {
var e=function e(t,a){var n=document.createElement("script");n.type="text/javascript",n.async=!1,n.src=t,e.ieCallback=e.ieCallback||function(t,a){"loaded"===t.readyState||"complete"===t.readyState?a():setTimeout(function(){e.ieCallback(t,a)},100)},"function"==typeof a&&(void 0!==n.addEventListener?n.addEventListener("load",a,!1):n.onreadystatechange=function(){n.onreadystatechange=null,e.ieCallback(n,a)}),(e.firstScriptEl=e.firstScriptEl||document.getElementsByTagName("script")[0]).parentNode.insertBefore(n,e.firstScriptEl)};module.exports=e;
},{}],4:[function(require,module,exports) {
var t=function(t){"use strict";t=function(e,n,u,d){var l,s,p=[],m=function e(n){(n=p.shift())&&(n[1]?t.apply(this,n).anim(e):n[0]>0?setTimeout(e,1e3*n[0]):(n[0](),e()))};for(l in e.charAt&&(e=document.getElementById(e)),(e>0||!e)&&(n={},u=0,m(p=[].push([e||0]))),c(n,{padding:0,margin:0,border:"Width"},[o,r,i,f]),c(n,{borderRadius:"Radius"},[o+f,o+r,i+r,i+f]),++a,n)(s=n[l]).to||0===s.to||(s=n[l]={to:s}),t.defs(s,e,l,d);return t.iter(n,1e3*u,m),{anim:function(){return p.push([].slice.call(arguments)),this}}};var e,n,o="Top",r="Right",i="Bottom",f="Left",a=1,c=function(t,e,n,o,r,i,f){for(o in t)if(o in e){for(f=t[o],r=0;i=n[r];r++)t[o.replace(e[o],"")+i+(e[o]||"")]={to:0===f.to?f.to:f.to||f,fr:f.fr,e:f.e};delete t[o]}},u=(e=window)["r"+(n="equestAnimationFrame")]||e["webkitR"+n]||e["mozR"+n]||e["msR"+n]||e["oR"+n];return t.defs=function(e,n,o,r,i){i=n.style,e.a=o,e.n=n,e.s=o in i?i:n,e.e=e.e||r,e.fr=e.fr||(0===e.fr?0:e.s==n?n[o]:(window.getComputedStyle?getComputedStyle(n,null):n.currentStyle)[o]),e.u=(/\d(\D+)$/.exec(e.to)||/\d(\D+)$/.exec(e.fr)||[0,0])[1],e.fn=/color/i.test(o)?t.fx.color:t.fx[o]||t.fx._,e.mx="anim_"+o,n[e.mx]=e.mxv=a,n[e.mx]!=e.mxv&&(e.mxv=null)},t.iter=function(t,e,n){var o,r,i,f,a=+new Date+e;!function c(){if((o=a-(new Date).getTime())<50){for(r in t)(r=t[r]).p=1,r.fn(r,r.n,r.to,r.fr,r.a,r.e);n&&n()}else{for(r in o/=e,t){if((r=t[r]).n[r.mx]!=r.mxv)return;f=r.e,i=o,"lin"==f?i=1-i:"ease"==f?i=1-((i=2*(.5-i))*i*i-3*i+2)/4:"ease-in"==f?(i=1-i,i*=i*i):i=1-i*i*i,r.p=i,r.fn(r,r.n,r.to,r.fr,r.a,r.e)}u?u(c):setTimeout(c,20)}}()},t.fx={_:function(t,e,n,o,r,i){o=parseFloat(o)||0,n=parseFloat(n)||0,t.s[r]=(t.p>=1?n:t.p*(n-o)+o)+t.u},width:function(e,n,o,r,i,f){e._fr>=0||(e._fr=isNaN(r=parseFloat(r))?"width"==i?n.clientWidth:n.clientHeight:r),t.fx._(e,n,o,e._fr,i,f)},opacity:function(t,e,n,o,r,i){isNaN(o=o||t._fr)&&((o=e.style).zoom=1,o=t._fr=(/alpha\(opacity=(\d+)\b/i.exec(o.filter)||{})[1]/100||1),o*=1,n=t.p*(n-o)+o,r in(e=e.style)?e[r]=n:e.filter=n>=1?"":"alpha("+r+"="+Math.round(100*n)+")"},color:function(e,n,o,r,i,f,a,c){for(e.ok||(o=e.to=t.toRGBA(o),r=e.fr=t.toRGBA(r),0==o[3]&&((o=[].concat(r))[3]=0),0==r[3]&&((r=[].concat(o))[3]=0),e.ok=1),c=[0,0,0,e.p*(o[3]-r[3])+1*r[3]],a=2;a>=0;a--)c[a]=Math.round(e.p*(o[a]-r[a])+1*r[a]);(c[3]>=1||t.rgbaIE)&&c.pop();try{e.s[i]=(c.length>3?"rgba(":"rgb(")+c.join(",")+")"}catch(f){t.rgbaIE=1}}},t.fx.height=t.fx.width,t.RGBA=/#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/,t.toRGBA=function(e,n){return n=[0,0,0,0],e.replace(/\s/g,"").replace(t.RGBA,function(t,e,o,r,i,f,a,c,u,d,l,s,p,m,h){a=[e+e||i,o+o||f,r+r||a];var x=[c,u,d];for(t=0;t<3;t++)a[t]=parseInt(a[t],16),x[t]=Math.round(2.55*x[t]);n=[a[0]||x[0]||s||0,a[1]||x[1]||p||0,a[2]||x[2]||m||0,l||h||1]}),n},t}();module.exports=t;
},{}],5:[function(require,module,exports) {
function t(t){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)}module.exports=t;
},{}],1:[function(require,module,exports) {
var e=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],i=!0,o=!1,r=void 0;try{for(var a,s=e[Symbol.iterator]();!(i=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);i=!0);}catch(e){o=!0,r=e}finally{try{!i&&s.return&&s.return()}finally{if(o)throw r}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),t=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function i(e){var t,o=this;(n(this,i),this.model=e.data||{},this.RavenInstance=void 0,this.RAVEN_PROJECT="https://0a9f9e0203be4cff88075453bfdcce3b@sentry.exponea.com/12",this.RAVEN_CDN="https://cdn.ravenjs.com/3.24.2/raven.min.js",this.sentry=(t={use:!1,noConflict:!0},void 0===e.sentry?t:void 0!==e.sentry.use&&void 0!==e.sentry.noConflict?e.sentry:t),this.sentry.use&&"undefined"==typeof Raven)?require("./helpers/getScript.js")(this.RAVEN_CDN,function(t){o.configureRaven(o.sentry.noConflict),o.RavenInstance.context(function(){this.initialize(e)}.bind(o))}):this.sentry.use?(this.configureRaven(this.sentry.noConflict),this.initialize(e)):this.initialize(e);return this.model}return t(i,[{key:"initialize",value:function(e){var t=this;if(this.el=e.el||null,this.attach=e.attach||null,this.data=e.data||{},this.methods=e.methods||{},this.filters=e.filters||{},this.app=null,this.bannerId="e-"+this.getUuid(),this.recommendations=e.recommendations||{},this.scoped=e.scoped||!1,this.mounted=e.mounted||null,this.backdrop=e.backdrop||null,void 0===e.branded||null===e.branded||e.branded&&"black"!==e.branded&&"white"!==e.branded?this.branded="black":this.branded=e.branded,this.html=void 0!==e.html?e.html:void 0!==e.context&&void 0!==e.context.html?e.context.html:null,this.style=void 0!==e.style?e.style:void 0!==e.context&&void 0!==e.context.style?e.context.style:null,this.sdk=void 0!==e.context&&void 0!==e.context.sdk?(e.context.sdk._&&t.RavenInstance.setTagsContext({project_token:e.context.sdk._[0][1][0].token}),e.context.sdk):null,this.context=void 0!==e.context&&void 0!==e.context.data?(e.context.data.banner_id&&e.context.data.banner_name&&t.RavenInstance.setTagsContext({banner_id:e.context.data.banner_id,banner_name:e.context.data.banner_name}),e.context.data):null,this.inPreview=void 0!==e.context&&void 0!==e.context.inPreview&&e.context.inPreview,this.__storage={loopDefinitions:{},initializedLoops:{}},void 0===e.tracking?this.tracking=!0:this.tracking=e.tracking,this.trigger=e.trigger||null,null!==this.trigger&&!this.inPreview){if("onready"==this.trigger.type){var n=this.trigger.delay||0,i=this;return void window.addEventListener("load",function(){setTimeout(function(){i.inject()},n)})}if("onexit"==this.trigger.type){var o=this.trigger.delay||0;window.__exp_triggered=!1;i=this;return void document.body.addEventListener("mouseleave",function(e){e.offsetY-window.scrollY<0&&!window.__exp_triggered&&(window.__exp_triggered=!0,setTimeout(function(){i.inject(i)},o))})}if(this.trigger.type="onaction"){i=this;var r=this.trigger.action||"click",a=this.trigger.delay||0;if(this.trigger.element){this.trigger.element.addEventListener(r,function e(){setTimeout(function(){i.inject(i)},a),i.trigger.element.removeEventListener(r,e,!1)})}return}throw"Incorrect trigger type "+this.trigger.type}return this.inject()}},{key:"configureRaven",value:function(t){if(t){if(this.RavenInstance=Raven.noConflict(),this.RavenInstance.config(this.RAVEN_PROJECT,{tags:{instance:"exp"}}).install(),this.RavenInstance.isSetup()){var n=!1;document.cookie.split(/\s*;\s*/).forEach(function(t){var i=t.split(/=/),o=e(i,2),r=o[0],a=o[1];"__exponea_etc__"==r&&(n=decodeURIComponent(a))}),n&&this.RavenInstance.setUserContext({exponea_cookie:n})}}else this.RavenInstance=Raven}},{key:"inject",value:function(){return this.render(),this.initializeModel(this.data),this.bindModels(),this.bindMethods(),this.bindAttributes(),this.bindClose(),this.bindFors(),this.bindIfs(),this.loadRecommendations(),null!==this.backdrop&&this.addBackdrop(),!1!==this.branded&&this.addBranding(),this.addAnimationClass(),this.tracking&&null!==this.sdk&&null!==this.context&&this.sdk.track("banner",this.getEventProperties("show",!1)),null===this.mounted||this.control_group||this.mounted.call(this.model),this.model}},{key:"initializeModel",value:function(e){var t=this;if(Object.keys(e).forEach(function(n){var i=e[n];Object.defineProperty(t.model,n,{enumerable:!0,get:function(){return i},set:function(e){i=e,t.updateBindings(n,i),t.updateModels(n,i),t.updateIfs(n,i),t.updateAttributes(n,i)}}),t.model[n]=i}),null!==this.methods){var n=!0,i=!1,o=void 0;try{for(var r,a=Object.keys(this.methods)[Symbol.iterator]();!(n=(r=a.next()).done);n=!0){var s=r.value;this.model[s]=this.methods[s]}}catch(e){i=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(i)throw o}}}this.model.$anim=require("./helpers/anim.js"),this.model.$validateEmail=require("./helpers/validateEmail.js"),this.model.removeBanner=this.removeBanner.bind(this,this.app),this.model.sdk=this.sdk}},{key:"render",value:function(){var e=this;if(null!==this.el)this.app=document.querySelector(this.el);else{if(null===this.html)return;var t=document.createElement("div");t.innerHTML=this.html.trim(),null!==this.attach?this.app=document.querySelector(this.attach).appendChild(t.firstChild):this.app=document.body.appendChild(t.firstChild)}if(null!==this.style)if(this.scoped){var n=this.addStyle(this.style,!0),i="";this.listify(n.sheet.cssRules).forEach(function(t){t instanceof CSSStyleRule&&(i+=e.generateScopedRule(t)),t instanceof CSSMediaRule&&(i=i+"@media "+t.conditionText+" {",e.listify(t.cssRules).forEach(function(t){i+=e.generateScopedRule(t)}),i+="}")}),n.parentNode.removeChild(n),this.addStyle(i)}else this.addStyle(this.style)}},{key:"bindModels",value:function(){var e=this,t=["email","number","search","tel","text","url","checkbox","radio"].map(function(e){return'input[type="'+e+'"][exp-model]'});t=t.concat(["textarea[exp-model]","select[exp-model]"]),this.select(t.join()).forEach(function(t){var n=t.getAttribute("exp-model"),i=t.getAttribute("type");"checkbox"===i?t.addEventListener("change",function(t){e.model[n]=t.target.checked}):"radio"===i?t.addEventListener("change",function(t){e.model[n]=t.target.value}):t.addEventListener("input",function(t){e.model[n]=t.target.value})})}},{key:"bindMethods",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,t=this,n=["click","submit","input","hover","blur","focus","mouseenter","mouseleave","action"],i=n.map(function(e){return"*[exp-"+e+"]"});this.select(i.join(),e).forEach(function(e){n.forEach(function(n){var i=e.getAttribute("exp-"+n);"action"==n&&e.addEventListener("click",function(e){this.tracking&&null!==this.sdk&&null!==this.context&&this.sdk.track("banner",this.getEventProperties("click"))}),null!==i&&i in t.methods&&e.addEventListener(n,function(e){t.methods[i].apply(t.model,[e])})})})}},{key:"bindAttributes",value:function(){var e=this,t=["src","href","alt","title","disabled"],n=t.map(function(e){return"*[exp-"+e+"]"});this.select(n.join()).forEach(function(n){t.forEach(function(t){var i=n.getAttribute("exp-"+t);null!==i&&i in e.model&&n.setAttribute(t,e.model[i])})})}},{key:"bindClose",value:function(){var e=this;this.select("[exp-close]").forEach(function(t){t.addEventListener("click",function(t){t.stopPropagation(),t.preventDefault(),e.removeBanner(),e.tracking&&null!==e.sdk&&null!==e.context&&e.sdk.track("banner",e.getEventProperties("close"))})})}},{key:"bindIfs",value:function(){var e=this;this.select("[exp-if]").forEach(function(t){var n=t.getAttribute("exp-if");if(null===e.model[n]||void 0===e.model[n])throw"exp-if attribute "+n+" is not defined in model.";t.style.display=e.model[n]?"block":"none"})}},{key:"bindRefs",value:function(){var e=this;this.select("[exp-ref]").forEach(function(t){var n=t.getAttribute("exp-ref");n&&""!==n&&(e.model.$refs[n]=t)})}},{key:"bindFors",value:function(){var e=this;this.select("[exp-for], [exp-rcm]").forEach(function(t){var n=t.hasAttribute("exp-for")?"exp-for":"exp-rcm",i=t.getAttribute(n).split(" ")[0],o=t.getAttribute(n).split(" ")[2],r=(e.getUuid(),t.cloneNode(!0));if(r.removeAttribute("exp-for"),o in e.__storage.loopDefinitions){var a=null!==t.nextElementSibling&&null!==t.nextElementSibling.getAttribute("exp-for")?null:t.nextElementSibling;e.__storage.loopDefinitions[o].push({template:r,parentElement:t.parentNode,siblingElement:a})}else{var s=null!==t.nextElementSibling&&null!==t.nextElementSibling.getAttribute("exp-for")?null:t.nextElementSibling;e.__storage.loopDefinitions[o]=[{template:r,parentElement:t.parentNode,siblingElement:s}]}t.remove(),e.model[o]?e.model[o].forEach(function(t){e.renderNewElement(o,i,t)}):e.model[o]=[],e.overridePush(e.model[o],o,i)})}},{key:"writeBindValue",value:function(e,t){var n=t.getAttribute("exp-bind").split("|");if(n.length>1){for(var i=e,o=1;o<n.length;o++){var r=n[o].trim();r in this.filters&&(i=this.filters[r].call(this.model,i))}t.textContent=i}else t.textContent=e}},{key:"updateBindings",value:function(e,t){var n=this;arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.select('*[exp-bind~="'+e+'"]').forEach(function(e){n.writeBindValue(t,e)})}},{key:"updateModels",value:function(e,t){this.select('*[exp-model="'+e+'"]').forEach(function(e){e.getAttribute("exp-model");var n=e.getAttribute("type");"checkbox"==n?e.checked=!!t:"radio"==n?e.value==t&&(e.checked=!0):e.value=t})}},{key:"updateIfs",value:function(e,t){this.select('*[exp-if="'+e+'"]').forEach(function(e){e.style.display=t?"block":"none"})}},{key:"updateAttributes",value:function(e,t){var n=["src","href","alt","title","disabled"],i=n.map(function(t){return"*[exp-"+t+'="'+e+'"]'}),o=this;this.select(i.join()).forEach(function(e){n.forEach(function(t){var n=e.getAttribute("exp-"+t);null!==n&&n in o.model&&(e[t]=o.model[n])})})}},{key:"renderNewElement",value:function(e,t,n){var i=this,o=["src","href","alt"],r=!0,a=!1,s=void 0;try{for(var l,d=this.__storage.loopDefinitions[e][Symbol.iterator]();!(r=(l=d.next()).done);r=!0){expForInstance=l.value;var c=expForInstance.template.cloneNode(!0),u=o.map(function(e){return"*[exp-"+e+"]"}),h=this.select(u.join(),c),p=this.select("[exp-bind]",c);h.forEach(function(e){o.forEach(function(t){var o=e.getAttribute("exp-"+t);if(null!==o)if(-1==o.indexOf("."))e[t]=n;else{var r=o.split("."),a=i.findLastField(r.slice(1),n);e[t]=a}})}),p.forEach(function(e){var t=e.getAttribute("exp-bind");if(-1==t.indexOf("."))i.writeBindValue(n,e);else{var o=t.split("."),r=i.findLastField(o.slice(1),n);e.textContent=r}}),expForInstance.parentElement.insertBefore(c,expForInstance.siblingElement)}}catch(e){a=!0,s=e}finally{try{!r&&d.return&&d.return()}finally{if(a)throw s}}}},{key:"overridePush",value:function(e,t,n){var i,o=this;e.push=(i=Array.prototype.push,function(){var e=i.apply(this,arguments);return o.renderNewElement(t,n,arguments[0]),e})}},{key:"addStyle",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(null!==this.app){var n=document.createElement("style");n.type="text/css",n.appendChild(document.createTextNode(e));var i=this.app.appendChild(n);return i.sheet.disabled=t,i}}},{key:"generateScopedRule",value:function(e){var t=this;return e.selectorText.split(",").map(function(e){var n="exp-"+t.getUuid();return t.addAttributes(e.trim(),n),e.includes(".exponea-animate")?e+"["+t.bannerId+"]":t.select(e.trim()).length>0?e+"["+n+"]":""+e}).join()+" { "+e.style.cssText+" }"}},{key:"addBackdrop",value:function(){var e=this;if(null!=this.app){var t={position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh","z-index":"9999",background:"rgba(0,0,0,0.7)"},n=!0,i=!1,o=void 0;try{for(var r,a=Object.keys(this.backdrop)[Symbol.iterator]();!(n=(r=a.next()).done);n=!0){var s=r.value;t[s]=this.backdrop[s]}}catch(e){i=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(i)throw o}}var l=document.createElement("div");this.setStyleFromObject(t,l),this.app.parentNode.style.position="relative",this.app.style["z-index"]="9999999",this.backdrop=this.app.parentNode.appendChild(l),this.backdrop.addEventListener("click",function(t){t.stopPropagation(),t.preventDefault(),e.removeBanner()})}}},{key:"addBranding",value:function(){if(null!==this.app){var e=document.createElement("object"),t=this.getUuid();e.setAttribute("e"+t,""),this.addStyle("[e"+t+"]{font-size:11px;position:absolute;opacity:.6;right:5px;bottom:5px;padding-top:0;text-decoration:none;display:block}[e"+t+"]:hover{opacity:.9}[e"+t+"] a{color: "+this.branded+"}"),e.innerHTML='<a href="https://exponea.com/?utm_campaign=exponea-web-layer&amp;utm_medium=banner&amp;utm_source=referral" target="_blank">Powered by Exponea</a>',this.app.appendChild(e)}}},{key:"addAnimationClass",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"exponea-animate";null!==this.app&&(this.app.classList?(this.app.setAttribute(this.bannerId,""),this.app.classList.add(e)):this.app.className+=" "+e)}},{key:"loadRecommendations",value:function(){var e=this;Object.keys(this.recommendations).forEach(function(t){if(e.model[t]){var n={recommendationId:e.recommendations[t].id,size:e.recommendations[t].total,callback:function(n){n&&n.length>0&&n.forEach(function(n){e.model[t].push(n)}),void 0!==e.recommendations[t].loadingKey&&(e.model[e.recommendations[t].loadingKey]=!0)},fillWithRandom:!0};e.sdk&&e.sdk.getRecommendation?e.sdk.getRecommendation(n):void 0!==e.recommendations[t].loadingKey&&(e.model[e.recommendations[t].loadingKey]=!0)}})}},{key:"removeBanner",value:function(){null!==this.app&&(this.app.parentNode.removeChild(this.app),null!==this.backdrop&&this.backdrop.parentNode.removeChild(this.backdrop))}},{key:"listify",value:function(e){return Array.prototype.slice.call(e)}},{key:"select",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.app;if(null===t)return[];var n=this.listify(t.querySelectorAll(e));return t.matches(e)&&n.push(t),n}},{key:"addAttributes",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";this.select(e).forEach(function(e){e.setAttribute(t,n)})}},{key:"getUuid",value:function(){var e=46656*Math.random()|0,t=46656*Math.random()|0;return(e=("000"+e.toString(36)).slice(-3))+(t=("000"+t.toString(36)).slice(-3))}},{key:"setStyleFromObject",value:function(e,t){for(var n in e)t.style[n]=e[n]}},{key:"getEventProperties",value:function(e,t){if(null!==this.context)return{action:e,banner_id:this.context.banner_id,banner_name:this.context.banner_name,banner_type:this.context.banner_type,variant_id:this.context.variant_id,variant_name:this.context.variant_name,interaction:!1!==t,location:window.location.href,path:window.location.pathname}}},{key:"findLastField",value:function(e,t){return 1==e.length?t[e[0]]:rec(e.slice(1),t[e[0]])}}]),i}();window.Exp=i;
},{"./helpers/getScript.js":3,"./helpers/anim.js":4,"./helpers/validateEmail.js":5}]},{},[1])
>>>>>>> Build js files
