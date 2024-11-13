const express = require('express');
const pages = require('../pages/pages');
const Car = require('../models/car');
const fs = require('fs').promises;  // Using fs.promises for async file reading

const router = express.Router();

// Return page content (base)
router.get('/page/:page', async (req, res) => {
    const page = req.params.page;
    if (pages[page]) {
        try {
            const populatedHtml = await loadPage(page);  // Await the populated HTML
            res.send(populatedHtml);
        } catch (err) {
            console.error(`Error loading page ${page}:`, err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(404).send('Page not found');
    }
});

async function loadPage(page) {
    const pagePath = pages[page];
    try {
        const data = await fs.readFile(pagePath, 'utf-8');
        let htmlTemplate = data;
        let populatedTable = '';

        // Dynamically load content based on page type
        switch (page) {
            case 'catalog':
                populatedTable = await loadCatalogue();
                break;
            case 'reservation-list':
                populatedTable = await loadReservations();
                break;
            case 'user-list':
                populatedTable = await loadUsers();
                break;
            default:
                break;
        }

        // Replace the placeholder with dynamic content
        return htmlTemplate.replace('{{tableData}}', populatedTable);

    } catch (err) {
        console.error(`Error reading page template: ${page}`, err);
        throw new Error('Error loading page template');
    }
}

async function loadCatalogue() {
    let vehicleData = '';
    try {
        // Fetch vehicle data from the database
        const cars = await Car.find();
        vehicleData = cars.map(car => car.toObject());
    } catch (err) {
        throw new Error('Error fetching cars');
    }

    let vehicleTableHtml = '';
    vehicleData.forEach(vehicle => {
        vehicleTableHtml += `
            <tr>
                <td><img src="${vehicle.img}" alt="Car image" width="100"></td>
                <td>${vehicle.regNr}</td>
                <td>${vehicle.make} ${vehicle.model}</td>
                <td>${vehicle.status}</td>
                <td><button onclick="showData('car', ${vehicle._id})">View</button></td>
            </tr>
        `;
    });
    return vehicleTableHtml;
}

// TODO: Define other functions

module.exports = router;
