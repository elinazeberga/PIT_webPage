const userModel = require('../models/user');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createUserTableRow = require('../renderers/userRenderer');
const {processSelectFields, replaceTemplateFields} = require('../renderers/rendererUtils');

async function loadUsers() {
    try {
        const users = await userModel.find();
        return users.map(user => createUserTableRow(user.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load users: ${error.message}`);
    }
}

async function loadUser(template, param) {
    if (param === 'new') {
        return replaceTemplateFields(template, DEFAULT_FIELDS.user);
    }

    try {
        const user = await userModel.findById(param);
        if (!user) {
            throw new Error('User not found');
        }

        const fields = {
            userID: param,
            userName: user.name,
            userSurname: user.lastName,
            userEmail: user.email,
            userPhone: user.phone,
            userLicense: user.licenseNr
        };

        template = processSelectFields(template, user, ['role', 'loyalty']);
        return replaceTemplateFields(template, fields);
    } catch (error) {
        throw new Error(`Failed to load user: ${error.message}`);
    }
}

module.exports = {loadUsers, loadUser};