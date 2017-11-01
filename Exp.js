function Exp(settings) {
    var app = document.querySelector(settings.el);
    if (app === null) return {};
    var data = {};
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

    // initialize data and add eventlistener to each input
    for (var i = 0; i < inputs.length; i++) {
        (function(input) {
            var model = input.getAttribute(modelName);
            data[model] = input.value;

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

    var model = settings.model;
    Object.keys(model).forEach(function(key) {
        // Store defined value for each key
        var value = model[key];
        Object.defineProperty(model, key, {
            enumerable: true,
            get: function() { return value },
            set: function(val) {
                value = val;
                var binds = selectorToArray('[exp-bind=' + key + ']');
                var models = selectorToArray('[exp-model=' + key + ']');
                binds.concat(models).forEach(function(el) {
                    if (el.getAttribute('exp-bind')) el.textContent = value;
                    if (el.getAttribute('exp-model')) el.value = value;
                });
            }
        });

        model[key] = value;

        document.querySelectorAll('[exp-model=' + key + ']').forEach(function(el) {
            function handler() {
                model[key] = el.value;
            };
            el.addEventListener('keyup', handler);
            el.addEventListener('change', handler);
        })


    });

    return data;
}
