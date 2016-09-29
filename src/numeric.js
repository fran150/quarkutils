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
