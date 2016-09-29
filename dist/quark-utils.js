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

$$.formatters.numeric = {
    read: function(value) {
        if ($$.isObject(value) && $$.isDefined(value.value) && $$.isDefined(value.config)) {
            return $$.formatNumber(value.value, value.config);
        } else {
            return $$.formatNumber(value);
        }
    },
    write: function(value) {
        if ($$.isObject(value) && $$.isDefined(value.value) && $$.isDefined(value.config)) {
            return $$.unformatNumber(value.value, value.config);
        } else {
            return $$.unformatNumber(value);
        }
    }
}

$$.formatters.money = {
    read: function(value) {
        if ($$.isObject(value) && $$.isDefined(value.value) && $$.isDefined(value.config)) {
            return $$.formatMoney(value.value, value.config);
        } else {
            return $$.formatMoney(value);
        }
    },
    write: function(value) {
        if ($$.isObject(value) && $$.isDefined(value.value) && $$.isDefined(value.config)) {
            return $$.unformatMoney(value.value, value.config);
        } else {
            return $$.unformatMoney(value);
        }
    }
}

ko.bindingHandlers.rowSelect = {
    update: function (element, valueAccessor, allBindings, viewModel, context) {
        var value = ko.unwrap(valueAccessor());
        var selected = allBindings.get('selectedValue');
        var style = allBindings.get('style');

        if (!ko.isObservable(selected)) {
            throw new Error('Must specify the selected value as an observable using the selectedValue binding');
        }

        if (!style) {
            style = "success";
        }

        var selectedValueAccessor = function () {
            var bindOptions = {};

            if (value == selected()) {
                bindOptions[style] = true;
            } else {
                bindOptions[style] = false;
            }

            return { success: bindOptions };
        };

        ko.bindingHandlers.css.update(element, selectedValueAccessor, allBindings, viewModel, context);

        var clickValueAccessor = function () {
            selected(value);
        };

        ko.bindingHandlers.click.init(element, clickValueAccessor, allBindings, viewModel, context);
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

