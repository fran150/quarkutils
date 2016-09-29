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
