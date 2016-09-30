// Check if the fields has value
ko.validators.required = function (observable, config) {
    var self = this;

    // Validate
    this.validate = function (newValue) {
        observable.validationReset();

        // Si no tiene un valor valido genera el error
        if (!newValue) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} es obligatorio').replace('{0}', observable.validatable));

            return false;
        }

        return true;
    };

    return this;
}

// Checks the length of the field. It can validate a minimun or a maximun size of chars in the string.
ko.validators.length = function (observable, config) {
    var self = this;

    this.validate = function (newValue) {
        observable.validationReset();

        var length = 0;

        // If it has a valid value get the fields length
        if (newValue) length = newValue.length;

        // If theres a min configured and length is less
        if (config['min'] && length < config.min) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} debe tener al menos {1} caracteres')
                .replace('{0}', observable.validatable)
                .replace('{1}', config.min)
                .replace('{2}', config.max)
            );

            return false;
        }

        // If theres a max configured and length is larger
        if (config['max'] && length > config.max) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} debe tener como maximo {2} caracteres')
                .replace('{0}', observable.validatable)
                .replace('{1}', config.min)
                .replace('{2}', config.max)
            );

            return false;
        }

        return true;
    };

    return this;
}

// Checks that the field has a valid number
ko.validators.number = function (observable, config) {
    var self = this;

    this.validate = function (newValue) {
        observable.validationReset();

        // If its not a number show error
        if (newValue !== '' && isNaN(newValue)) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} debe ser un numero valido')
                .replace('{0}', observable.validatable)
            );

            return false;
        }

        return true;
    };

    return this;
}

// Checks that the field is an integer
ko.validators.integer = function (observable, config) {
    var self = this;

    this.validate = function (newValue) {
        observable.validationReset();

        // If its not an integer show error
        if (newValue !== '' && !$$.canBeInt(newValue)) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} debe ser un numero entero valido')
                .replace('{0}', observable.validatable)
            );

            return false;
        }

        return true;
    };

    return this;
}

// Check if the value is a valid date.
ko.validators.date = function (observable, config) {
    var self = this;

    this.validate = function (newValue) {
        observable.validationReset();

        var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

        // If its not a valid date show error
        if (newValue !== '' && !pattern.test(newValue)) {
            observable.hasError(true);
            observable.validationMessage((config['message'] || 'El campo {0} debe ser una fecha valida')
                .replace('{0}', observable.validatable)
            );

            return false;
        }

        return true;
    };

    return this;
}
