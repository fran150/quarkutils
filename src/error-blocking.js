// Returns the css for the blocker overlay
function getBlockerCss(warning) {
    // Default error is with danger style
    var cssError = {
        message: 'Error',
        overlayCSS: {
            backgroundColor: '#A94442',
            opacity: 0.5,
        },
        css: {
            border: 'none',
            padding: '5px',
            backgroundColor: '#000',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            backgroundColor: '#A94442',
            opacity: 1,
            color: '#fff'
        },
        baseZ: 900
    }

    // If warning style overwrite properties
    if (warning) {
        cssError.message = 'Hay problemas con este elemento.';
        cssError.overlayCSS = {
            backgroundColor: '#FCF8E3',
            opacity: 0.4,
        };
        cssError.css.backgroundColor = '#FCF8E3';
        cssError.css.color = '#000';
    }

    return cssError;
}

// Block the specified element, value is an array of errors, if the array is empty unblock the element.
function blockError(element, value, warning) {
    if (value.length) {
        $(element).block(getBlockerCss(warning));
    } else {
        $(element).unblock();
    }
}

// Blocks the specified element when the error handler contains errors.
// Errors with level > 2000
ko.bindingHandlers.blockOnError = {
    init: function (element, valueAccessor, allBindings, viewModel, context) {
        var handler = viewModel.errorHandler;
        var value = handler.getByLevel(2000, 9999);

        function validate(value) {
            if ($$.isArray(value)) {
                blockError(element, value, true);
            }
        }

        var subscription = value.subscribe(validate);

        validate(value());

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            subscription.dispose();
        });
    }
}

// Blocks the specified element when the error handler contains errors or warnings.
// Errors with level > 2000 block the element with red
// Errors with level >= 1000 and < 2000 block the element with yellow
ko.bindingHandlers.blockOnWarning = {
    init: function (element, valueAccessor, allBindings, viewModel, context) {
        var handler = viewModel.errorHandler;
        var value = handler.getByLevel(1000, 9999);

        function validate(value) {
            if ($$.isArray(value)) {
                for (var index in value) {
                    var error = value[index];

                    if (error.level > 2000) {
                        blockError(element, value);
                        return;
                    }

                    if (error.level >= 1000 && error.level < 2000) {
                        blockError(element, value, true);
                        return;
                    }
                }
            }
        }

        var subscription = value.subscribe(validate);

        validate(value());

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            subscription.dispose();
        });
    }
}

// Blocks the element if the specified error handler contains errors of the specified source
ko.bindingHandlers.blockOnErrorSource = {
    init: function (element, valueAccessor, allBindings, viewModel, context) {
        var source = ko.unwrap(valueAccessor());
        var handler = viewModel.errorHandler;
        var value = handler.getBySource(source);

        function validate(value) {
            if ($$.isArray(value)) {
                blockError(element, value);
            }
        }

        var subscription = value.subscribe(validate);

        validate(value());

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            subscription.dispose();
        });
    }
}

// Blocks the element if the specified error handler contains errors that fullfills the specified condition
ko.bindingHandlers.blockOnErrorCondition = {
    init: function (element, valueAccessor, allBindings, viewModel, context) {
        var condition = ko.unwrap(valueAccessor);
        var handler = viewModel.errorHandler;
        var value = handler.getBy(condition);

        function validate(value) {
            if ($$.isArray(value)) {
                blockError(element, value);
            }
        }

        var subscription = value.subscribe(validate);

        validate(value());

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            subscription.dispose();
        });
    }
}
