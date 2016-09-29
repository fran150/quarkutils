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
