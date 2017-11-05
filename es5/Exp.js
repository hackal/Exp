function Exp(settings) {
    var app = document.querySelector(settings.el);
    if (app === null) return {};

    // copy user's initial declaration of variables
    var data = {};
    if (settings.data) {
        Object.keys(settings.data).forEach(function(key) {
            data[key] = settings.data[key];
        })
    }

    var methods = settings.methods;

    // move methods to data (allow use outside html)
    for (key in methods) {
        data[key] = methods[key];
    }

    // find all supported inputs with exp-model
    var modelName = "exp-model";
    var supportedInputs = ["email", "number", "search", "tel", "text", "url"];

    // build selector from supported inputs and model name
    var inputSelectors = [];
    supportedInputs.forEach(function(inputType) {
        inputSelectors.push("input[type=\"" + inputType + "\"][" + modelName + "]");
    });

    var inputs = app.querySelectorAll(inputSelectors.join());

    // initialise data key if not declared by user and add eventlistener to each input
    for (var i = 0; i < inputs.length; i++) {
        (function(input) {
            var model = input.getAttribute(modelName);
            if (data[model] == null) {
                data[model] = input.value;
            }
            input.addEventListener("input", function(e) {
                 data[model] = e.target.value;
            });
        })(inputs[i]);
    }

    var supportedEvents = ["click", "submit"];
    var eventSelectors = [];
    supportedEvents.forEach(function(event) {
        eventSelectors.push("*[exp-" + event + "]");
    });
    
    var events = app.querySelectorAll(eventSelectors.join());
    for (var i = 0; i < events.length; i++) {
        supportedEvents.forEach(function(event) {
            (function(el) {
                var method = el.getAttribute('exp-' + event);
                if (method === null || !(method in methods)) return;
                el.addEventListener(event, function() {
                    methods[method].apply(data);
                });
            })(events[i]);
        });
    }
    
    // bind elements to data store
    Object.keys(data).forEach(function(key) {
        var value = data[key];
        // override get, set methods of each key
        Object.defineProperty(data, key, {
            enumerable: true,
            get: function() { return value },
            set: function(val) {
                value = val;
                var binds = Array.prototype.slice.call(document.querySelectorAll('[exp-bind=' + key + ']'));
                var models = Array.prototype.slice.call(document.querySelectorAll('[exp-model=' + key + ']'));
                binds.concat(models).forEach(function(el) {
                    // for exp-bind elements change content according to data store
                    if (el.getAttribute('exp-bind')) el.textContent = value;
                    // for exp-model change the data store according to element's value
                    if (el.getAttribute('exp-model')) el.value = value;
                });
            }
        });

        data[key] = value;

    });

    return data;
}
