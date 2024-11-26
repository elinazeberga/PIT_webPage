const express = require('express');
const pages = require('../templates/pages');
const loadPage = require('../middleware/loadPage.js');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Return page content (base)
router.get('/page/:page/:param', authenticateAdmin, async (req, res) => {
    const page = req.params.page;
    const param = req.params.param;
    if (pages[page]) {
        try {
            const populatedHtml = await loadPage(page, param);  // Await the populated HTML
            res.json(populatedHtml);
        } catch (err) {
            console.error(`Error loading page ${page}:`, err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(404).send('Page not found');
    }
});

module.exports = router;