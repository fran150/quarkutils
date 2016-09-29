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
