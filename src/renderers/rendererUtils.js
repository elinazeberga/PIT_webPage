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

function createSelectOptions(template, selfField, items, placeholder, labelFn) {
    let options = items
        .map(item => `<option value="${item._id}">${labelFn(item)}</option>`)
        .join('');
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