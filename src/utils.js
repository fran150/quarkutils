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
