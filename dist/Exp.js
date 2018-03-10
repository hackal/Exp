/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exp = function () {
    function Exp(settings) {
        _classCallCheck(this, Exp);

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

        if (settings.backdrop) this.addBackdrop();
        if (settings.position) this.moveToPosition(settings.position);

        this.loaded();
        return this.model;
    }

    _createClass(Exp, [{
        key: "init",
        value: function init() {
            var _this = this;

            if (this.el !== null) {
                this.app = document.querySelector(this.el);
            } else if (this.html !== null) {
                var el = document.createElement('div');
                el.innerHTML = this.html.trim();
                if (this.attatch !== null) {
                    this.app = document.querySelector(this.attatch).appendChild(el.firstChild).parentNode;
                } else {
                    this.app = document.body.appendChild(el);
                }
            }

            if (this.style !== null) {
                if (this.scoped) {
                    var style = this.addStyle(this.style, true);
                    var rules = this.listify(style.sheet.cssRules);
                    var scopedStyle = "";

                    rules.forEach(function (rule) {
                        if (rule instanceof CSSStyleRule) {
                            scopedStyle = scopedStyle + _this.generateScopedRule(rule);
                        }
                        if (rule instanceof CSSMediaRule) {
                            scopedStyle = scopedStyle + ("@media" + rule.conditionText + " {");
                            _this.listify(rule.cssRules).forEach(function (rule) {
                                scopedStyle = scopedStyle + _this.generateScopedRule(rule);
                            });
                            scopedStyle = scopedStyle + "}";
                        }
                    });

                    this.addStyle(scopedStyle);
                    style.parentNode.removeChild(style);
                } else {
                    this.addStyle(this.style);
                }
            }

            this.methods.removeBanner = this.removeBanner.bind(this, this.app);
        }
    }, {
        key: "moveToPosition",
        value: function moveToPosition(position) {
            if ((typeof position === "undefined" ? "undefined" : _typeof(position)) === "object") {
                this.setStyleFromObject(position, this.app.firstChild);
            } else {
                this.setPositionFromString(position, this.app.firstChild);
            }

            this.setStyleFromObject({ "position": "fixed" }, this.app.firstChild);
        }
    }, {
        key: "setStyleFromObject",
        value: function setStyleFromObject(object, el) {
            for (var property in object) {
                el.style[property] = object[property];
            }
        }
    }, {
        key: "setPositionFromString",
        value: function setPositionFromString(position, el) {
            var _this2 = this;

            var offset = "20px";
            var positionStyles = {
                middle: {
                    "left": "50%",
                    "top": "50%",
                    "transform": "translate(-50%,-50%)"
                }
            };
            var positions = position.split(' ');
            positions.forEach(function (pos) {
                if (pos in positionStyles) {
                    _this2.setStyleFromObject(positionStyles[pos], el);
                } else {
                    var styleObj = {};
                    styleObj[pos] = offset;
                    _this2.setStyleFromObject(styleObj, el);
                }
            });
        }
    }, {
        key: "addBackdrop",
        value: function addBackdrop() {
            var backdropStyle = {
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100vw",
                "height": "100vh",
                "z-index": "999999",
                "background": "rgba(0,0,0,0.7)"
            };
            var backdrop = document.createElement('div');
            this.setStyleFromObject(backdropStyle, backdrop);
            this.app.style['position'] = "relative";
            this.app.firstChild.style["z-index"] = "9999999";
            this.app.appendChild(backdrop);
        }
    }, {
        key: "loaded",
        value: function loaded() {
            if (this.mounted !== null) this.mounted.call(this.model);
        }
    }, {
        key: "removeBanner",
        value: function removeBanner() {
            this.app.parentNode.removeChild(this.app);
        }
    }, {
        key: "addStyle",
        value: function addStyle(css) {
            var disabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css)); // doesn't work in IE8 and less

            var inserted = this.app.appendChild(style);
            inserted.sheet.disabled = disabled;
            return inserted;
        }
    }, {
        key: "getSelectorText",
        value: function getSelectorText(rules) {
            var ruleList = [];
            Array.prototype.slice.call(rules).forEach(function (rule) {
                ruleList.push(rule);
            });
        }
    }, {
        key: "addAttributes",
        value: function addAttributes(selector, attr) {
            this.select(selector).forEach(function (el) {
                el.setAttribute(attr, "");
            });
        }
    }, {
        key: "getUuid",
        value: function getUuid() {
            var firstPart = Math.random() * 46656 | 0;
            var secondPart = Math.random() * 46656 | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
    }, {
        key: "generateScopedRule",
        value: function generateScopedRule(rule) {
            var _this3 = this;

            var selectors = rule.selectorText.split(',');
            var selectorsText = selectors.map(function (selector) {
                var attr = "exp-" + _this3.getUuid();
                _this3.addAttributes(selector.trim(), attr);
                return selector + "[" + attr + "]";
            });

            return selectorsText.join() + " { " + rule.style.cssText + " }";
        }
    }, {
        key: "moveMethods",
        value: function moveMethods() {
            if (this.methods === null) return;

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
    }, {
        key: "updateBindings",
        value: function updateBindings(key, value) {
            var bindings = this.select("*[exp-bind=\"" + key + "\"]");

            bindings.forEach(function (el) {
                el.textContent = value;
            });
        }
    }, {
        key: "updateModels",
        value: function updateModels(key, value) {
            var modelBindings = this.select("*[exp-model=\"" + key + "\"]");

            modelBindings.forEach(function (input) {
                var model = input.getAttribute("exp-model");
                var type = input.getAttribute("type");

                if (type == "checkbox") {
                    input.checked = !!value;
                } else if (type == "radio") {
                    if (input.value == value) input.checked = true;
                } else {
                    input.value = value;
                }
            });
        }
    }, {
        key: "updateIfs",
        value: function updateIfs(key, value) {
            var expIfs = this.select("*[exp-if=\"" + key + "\"]");

            expIfs.forEach(function (el) {
                el.style.display = value ? "block" : "none";
            });
        }
    }, {
        key: "watcher",
        value: function watcher(model) {
            var that = this;
            Object.keys(model).forEach(function (key) {
                var value = model[key];

                Object.defineProperty(that.model, key, {
                    enumerable: true,
                    get: function get() {
                        return value;
                    },
                    set: function set(val) {
                        value = val;
                        that.updateBindings(key, value);
                        that.updateModels(key, value);
                        that.updateIfs(key, value);
                    }
                });

                that.model[key] = value;
            });
        }
    }, {
        key: "bindModels",
        value: function bindModels() {
            var _this4 = this;

            var selector = ["email", "number", "search", "tel", "text", "url", "checkbox", "radio"].map(function (input) {
                return "input[type=\"" + input + "\"][exp-model]";
            });
            selector = selector.concat(["textarea[exp-model]", "select[exp-model]"]);

            var inputs = this.select(selector.join());

            inputs.forEach(function (input) {
                var model = input.getAttribute("exp-model");
                var type = input.getAttribute("type");

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
    }, {
        key: "bindMethods",
        value: function bindMethods() {
            var that = this;
            var supportedEvents = ["click", "submit", "input"];
            var selector = supportedEvents.map(function (event) {
                return "*[exp-" + event + "]";
            });

            var events = this.select(selector.join());

            events.forEach(function (el) {
                supportedEvents.forEach(function (event) {
                    var method = el.getAttribute('exp-' + event);
                    if (method === null || !(method in that.methods)) return;

                    el.addEventListener(event, function (e) {
                        that.methods[method].apply(that.model, [e]);
                    });
                });
            });
        }
    }, {
        key: "listify",
        value: function listify(list) {
            return Array.prototype.slice.call(list);
        }
    }, {
        key: "select",
        value: function select(selector) {
            return this.listify(this.app.querySelectorAll(selector));
        }
    }]);

    return Exp;
}();

window.Exp = Exp;

/***/ })
/******/ ]);
//# sourceMappingURL=Exp.js.map