// Processes the select fields to show the associated
// database value as selected in a detailed view
function processSelectFields(template, data, fields) {
    fields.forEach(element => { // Loops through the defined select fields
        // Adds the 'selected' tag to the field.
        const elementValue = data[element].toString();
        template = template.replace(
            `value="${elementValue}"`,
            `value="${elementValue}" selected`
        );
    });
    return template;
}

// Process each field in the template by
// replacing it's placeholder with an associated value.
function replaceTemplateFields(template, fields) {
    return Object.entries(fields).reduce((acc, [key, value]) => {
        return acc.replace(`{{${key}}}`, value);
    }, template);
}

// Create select field options for dynamic fields.
// Example: creating vehicle fields for reservations
function createSelectOptions(template, selfField, items, placeholder, labelFn) {
    // Create options by having the value as ID.
    // labelFn defines the format it should be displayed.
    let options = items
        .map(item => `<option value="${item._id}">${labelFn(item)}</option>`)
        .join('');
    // Additional handling for deleted entries
    if (selfField !== null && !options.includes(selfField)){
        options += `<option value="${selfField}">Deleted: ${selfField}</option>`;
    }
    return template.replace(`{{${placeholder}}}`, options);
}

module.exports = {
    processSelectFields,
    replaceTemplateFields,
    createSelectOptions
}