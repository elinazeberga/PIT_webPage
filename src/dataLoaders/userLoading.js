const userModel = require('../models/user');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createUserTableRow = require('../renderers/userRenderer');
const {processSelectFields, replaceTemplateFields} = require('../renderers/rendererUtils');

// Load user table content
async function loadUsers() {
    try {
        // Load all users
        const users = await userModel.find();
        // Create rows for each user and join them together
        return users.map(user => createUserTableRow(user.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load users: ${error.message}`);
    }
}
// Load data for a single user
async function loadUser(template, param) {
    // If we are creating a new user, replace template fields
    if (param === 'new') {
        return replaceTemplateFields(template, DEFAULT_FIELDS.user);
    }

    try {
        // Load user information
        const user = await userModel.findById(param);
        if (!user) {
            throw new Error('User not found');
        }
        // Replace default fields
        const fields = {
            userID: param,
            userName: user.name,
            userSurname: user.lastName,
            userEmail: user.email,
            userPhone: user.phone,
            userLicense: user.licenseNr
        };
        // Process select fields to
        // show the associated values
        template = processSelectFields(template, user, ['role', 'loyalty']);
        return replaceTemplateFields(template, fields); // Replace input fields and return processed template
    } catch (error) { // Error handling
        throw new Error(`Failed to load user: ${error.message}`);
    }
}

module.exports = {loadUsers, loadUser};