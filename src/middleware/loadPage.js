const pages = require('../templates/pages.js');
const fs = require('fs').promises;
const processPage = require('./processPage.js');

async function loadPage(page, param) {
    try {
        const pagePath = pages[page];
        if (!pagePath) {
            throw new Error(`Invalid page: ${page}`);
        }
        const htmlTemplate = await fs.readFile(pagePath, 'utf-8');
        return await processPage(page, htmlTemplate, param);
    } catch (error) {
        console.error(`Error loading page: ${page}`, error);
        throw new Error(`Failed to load page: ${error.message}`);
    }
}

module.exports = loadPage;