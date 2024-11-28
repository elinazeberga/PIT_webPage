const pages = require('../templates/pages.js');
const fs = require('fs').promises;
const processPage = require('./processPage.js');

// Load content for a specific page
async function loadPage(page, param) {
    try {
        // Get page path
        const pagePath = pages[page];
        if (!pagePath) {
            throw new Error(`Invalid page: ${page}`);
        }
        // Load page template
        const htmlTemplate = await fs.readFile(pagePath, 'utf-8');
        // Process page content and return it
        return await processPage(page, htmlTemplate, param);
    } catch (error) {
        console.error(`Error loading page: ${page}`, error);
        throw new Error(`Failed to load page: ${error.message}`);
    }
}

module.exports = loadPage;