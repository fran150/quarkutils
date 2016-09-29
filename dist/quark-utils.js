(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['quark', 'knockout', 'jquery', 'accounting-js', 'blockui'], factory);
    } else {
        // Browser globals.
        root.komapping = ko.mapping;
        factory(root.$$, root.ko, root.$, root.accounting);
    }
}(this, function ($$, ko, $, accounting) {
// Do not bind inner bindings of the element
ko.bindingHandlers.stopBinding = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        return { controlsDescendantBindings: true };
    }
}

// Raises binding context one level to the parent, userful when specifying a content tag inside a binding that generates
// context, for example a foreach. If you don't use this the content will bind to the foreach context and not the component.
ko.bindingHandlers.upContext = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var newContext = context.$parentContext.extend({ $child: viewModel, $childContext: context });
        return ko.bindingHandlers.template.init(element, valueAccessor, allBindingsAccessor, context.$parent, newContext);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var newContext = context.$parentContext.extend({ $child: viewModel, $childContext: context });
        return ko.bindingHandlers.template.update(element, valueAccessor, allBindingsAccessor, context.$parent, newContext);
    }
};
ko.virtualElements.allowedBindings.upContext = true;

// Blocks user input for the specified target showing a message. If no target specified blocks entire screen
$$.block = function (message, target) {
    if (!message)
        message = 'Loading...';

    var options = {
        message: message,
        css: {
            border: 'none',
            padding: '5px',
            backgroundColor: '#000',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            opacity: .7,
            color: '#fff'
        },
        baseZ: 5000
    }

    if (target) {
        $(target).block(options);
    } else {
        $.blockUI(options);
    }
}

// Unblock user input from the specified target (JQuery Selector)
$$.unblock = function (target) {
    if (target) {
        $(target).unblock();
    } else {
        $.unblockUI();
    }
}

// If the value is not empty block the specified element showing the text in the value parameter
function block(element, value) {
    if (value) {
        $$.block(value, $(element));
    } else {
        $$.unblock($(element));
    }
}

// Block the element showing the specified text. If text is empty or undefined unblock.
ko.bindingHandlers.block = {
    init: function (element, valueAccessor, allBindings, viewModel, context) {
        var value = ko.unwrap(valueAccessor());
        block(element, value);
    },
    update: function (element, valueAccessor, allBindings, viewModel, context) {
        var value = ko.unwrap(valueAccessor());
        block(element, value);
    }
}

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

// If configuration object does not exist initialize it
if (!$$.configuration) {
    $$.configuration = {};
}

// Set the configuration for money formats
$$.configuration.moneyFormat = {
    symbol: '$ ',
    decimals: 2,
    separator: {
        thousands: '.',
        decimal: ','
    }
}

// Set the configuration for number formats
$$.configuration.numberFormat = {
    decimals: 2,
    separator: {
        thousands: '.',
        decimal: ','
    }
}

// Format the specified number allowing to override configuration passing an object with new values to the config parameter
$$.formatMoney = function(number, config) {
    config = $.extend({}, $$.configuration.moneyFormat, config);
    return accounting.formatMoney(number, config.symbol, config.decimals, config.separator.thousands, config.separator.decimal);
}

// Unformat the specified number allowing to override configuration passing an object with new values to the config parameter
$$.unformatMoney = function(number, config) {
    config = $.extend({}, $$.configuration.moneyFormat, config);
    var value = accounting.unformat(number, config.separator.decimal);
    return accounting.toFixed(value, config.decimals);
}

// Format the specified number allowing to override configuration passing an object with new values to the config parameter
$$.formatNumber = function(number, config) {
    config = $.extend({}, $$.configuration.numberFormat, config);
    return accounting.formatNumber(number, config.decimals, config.separator.thousands, config.separator.decimal);
}

// Unformat the specified number allowing to override configuration passing an object with new values to the config parameter
$$.unformatNumber = function(number, config) {
    config = $.extend({}, $$.configuration.numberFormat, config);
    var value = accounting.unformat(number, config.separator.decimal);
    return accounting.toFixed(value, config.decimals);
}

// Create a custom binding to transform the specified observable into money or number format
function numericTransform(element, valueAccessor, money, bindingName) {
    var underlyingObservable;

    // Get the specified value
    var accessor = valueAccessor();

    // Init custom config
    var config = {};


    if ($$.isObject(accessor)) {
        // If binding to an object we assume { value: <observable>, config: <custom config> }
        underlyingObservable = accessor.value;
        config = accessor.config;
    } else {
        // If binding is not an object we assume its the value to transform.
        underlyingObservable = accessor;
    }

    // If the value is not an observable then wrap it into one
    if (!ko.isObservable(underlyingObservable)) {
        underlyingObservable = ko.observable(underlyingObservable);
    }

    // If we are converting to money combine custom config with money defaults, if not use number defaults.
    if (money) {
        config = $.extend({}, $$.configuration.moneyFormat);
    } else {
        config = $.extend({}, $$.configuration.numberFormat);
    }

    // Create an interceptor for the binding
    var interceptor = ko.pureComputed({
        read: function () {
            // If value is defined transform it, if not, return undefined
            if ($$.isDefined(underlyingObservable())) {
                if (money) {
                    return $$.formatMoney(underlyingObservable(), config);
                } else {
                    return $$.formatNumber(underlyingObservable(), config);
                }
            } else {
                return undefined;
            }
        },

        write: function (newValue) {
            // Get the current value and the newly formatted value
            var current = underlyingObservable();
            var valueToWrite;

            // Get the value to write unformatting
            if (money) {
                valueToWrite = $$.unformatMoney(newValue, config.decimals);
            } else {
                valueToWrite = $$.unformatNumber(newValue, config.decimals);
            }

            // If value is not a number write the value as is
            if (isNaN(valueToWrite)) {
                valueToWrite = newValue;
            }

            // Write the value to the observable and notify
            if (valueToWrite !== current) {
                underlyingObservable(valueToWrite);
            } else {
                if (newValue !== current.toString()) {
                    underlyingObservable.valueHasMutated();
                }
            }
        }
    });

    // Create a custom accesor and apply bindings
    var binding = {};
    binding[bindingName] = interceptor;

    ko.applyBindingsToNode(element, binding);
}

ko.bindingHandlers.numericValue = {
    init: function (element, valueAccessor) {
        numericTransform(element, valueAccessor, false, 'value');
    }
}

ko.bindingHandlers.moneyValue = {
    init: function (element, valueAccessor) {
        numericTransform(element, valueAccessor, true, 'value');
    }
}

ko.bindingHandlers.numericText = {
    init: function (element, valueAccessor) {
        numericTransform(element, valueAccessor, false, 'text');
    }
}

ko.bindingHandlers.moneyText = {
    init: function (element, valueAccessor) {
        numericTransform(element, valueAccessor, true, 'text');
    }
}

// Applies the success style to the element if the specified condition is met. Useful highlight the selected row on a table:
// <div data-bind="rowSelect: id == $parent.idSeleccionado">
ko.bindingHandlers.rowSelect = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var options = ko.unwrap(valueAccessor());

        var selectedValueAccessor = function () {
            if ($$.isFunction(options.isSelected)) {
                return { success: options.isSelected(viewModel) };
            } else {
                return { success: options.isSelected };
            }

        };

        ko.bindingHandlers.css.update(element, selectedValueAccessor, allBindingsAccessor, viewModel, context);

        var clickValueAccessor = function () {
            return options.select;
        };

        ko.bindingHandlers.click.init(element, clickValueAccessor, allBindingsAccessor, viewModel, context);
    }
};

if (typeof define === 'function' && define.amd) {
    define('knockout', function() {
        return ko;
    });
}

// Register in the values from the outer closure for common dependencies
// as local almond modules
return $$;
}));

