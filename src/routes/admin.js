const express = require('express');
const pages = require('../pages/pages');

const router = express.Router();

// Return page content (base)
router.get('/:page', (req, res) => {
    const page = req.params.page;
    if (pages[page]) {
        res.sendFile(pages[page], (err) => {
            if (err) {
                console.error(`Error loading page: ${page}`, err);
                res.status(500).send('Internal Server Error');
            }
        });
    } else {
        res.status(404).send('Page not found');
    }
});

module.exports = router;