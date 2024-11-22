function processSelectFields(template, data, fields) {
    fields.forEach(element => {
        const elementValue = data[element].toString();
        template = template.replace(
            `value="${elementValue}"`,
            `value="${elementValue}" selected`
        );
    });
    return template;
}

function replaceTemplateFields(template, fields) {
    return Object.entries(fields).reduce((acc, [key, value]) => {
        return acc.replace(`{{${key}}}`, value);
    }, template);
}

function createSelectOptions(template, items, placeholder, labelFn) {
    const options = items
        .map(item => `<option value="${item._id}">${labelFn(item)}</option>`)
        .join('');
    return template.replace(`{{${placeholder}}}`, options);
}

module.exports = {
    processSelectFields,
    replaceTemplateFields,
    createSelectOptions
}