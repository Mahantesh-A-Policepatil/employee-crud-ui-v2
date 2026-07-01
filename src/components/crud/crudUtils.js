export function createEmptyForm(fields) {
    return fields.reduce(
        (form, field) => ({
            ...form,
            [field.name]: field.defaultValue !== undefined ? field.defaultValue : "",
        }),
        { id: null }
    );
}

export function validateForm(fields, form) {
    const errors = {};

    fields.forEach((field) => {
        const fieldValue = form[field.name];
        const value = Array.isArray(fieldValue) ? fieldValue : String(fieldValue || "").trim();

        if (field.required && (!value || value.length === 0)) {
            errors[field.name] = `${field.label} is required`;
            return;
        }

        if (!Array.isArray(value) && value && field.pattern && !field.pattern.test(value)) {
            errors[field.name] = field.patternMessage || `${field.label} is invalid`;
            return;
        }

        if (field.validate) {
            const customError = field.validate(value, form);
            if (customError) {
                errors[field.name] = customError;
            }
        }
    });

    return errors;
}

export function formatValidationErrors(validationErrors) {
    return Object.keys(validationErrors).reduce((errors, field) => {
        errors[field] = validationErrors[field][0];
        return errors;
    }, {});
}
