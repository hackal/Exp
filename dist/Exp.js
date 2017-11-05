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


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exp = function () {
    function Exp(settings) {
        _classCallCheck(this, Exp);

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

    _createClass(Exp, [{
        key: "moveMethods",
        value: function moveMethods() {
            if (this.methods === undefined) return;

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

            modelBindings.forEach(function (el) {
                el.value = value;
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
            var _this = this;

            var selector = ["email", "number", "search", "tel", "text", "url"].map(function (input) {
                return "input[type=\"" + input + "\"][exp-model]";
            });

            var inputs = this.select(selector.join());

            inputs.forEach(function (input) {
                var model = input.getAttribute("exp-model");
                input.value = _this.model[model];

                input.addEventListener("input", function (event) {
                    _this.model[model] = event.target.value;
                });
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

                    el.addEventListener(event, function () {
                        that.methods[method].apply(that.model);
                    });
                });
            });
        }
    }, {
        key: "select",
        value: function select(selector) {
            return Array.prototype.slice.call(this.app.querySelectorAll(selector));
        }
    }]);

    return Exp;
}();

window.Exp = Exp;

/***/ })
/******/ ]);
//# sourceMappingURL=Exp.js.map