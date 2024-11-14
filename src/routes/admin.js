const express = require('express');
const pages = require('../pages/pages');
const carModel = require('../models/car');
const bookingModel = require('../models/booking');
const userModel = require('../models/user');
const fs = require('fs').promises;  // Using fs.promises for async file reading

const router = express.Router();

// Return page content (base)
router.get('/page/:page/:param', async (req, res) => {
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

async function loadPage(page, param) {
    const pagePath = pages[page];
    try {
        const data = await fs.readFile(pagePath, 'utf-8');
        let htmlTemplate = data;
        // Dynamically load content based on page type
        switch (page) {
            case 'catalog':
                return [htmlTemplate.replace('{{tableData}}', await loadCatalogue())];
            case 'reservationlist':
                return [htmlTemplate.replace('{{tableData}}', await loadReservations())];
            case 'userlist':
                return [htmlTemplate.replace('{{tableData}}', await loadUsers())];
            case 'newvehicle':
                const script = await fs.readFile(pages['newvehiclescript'], 'utf-8');
                console.log(script);
                return [data, script];
        }
        // Replace the placeholder with dynamic content
    } catch (err) {
        console.error(`Error reading page template: ${page}`, err);
        throw new Error('Error loading page template');
    }
}

async function loadCatalogue() {
    let vehicleData = '';
    try {
        // Fetch vehicle data from the database
        const cars = await carModel.find();
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
                <td><button onclick="navigate('car', ${vehicle._id})">View</button></td>
            </tr>
        `;
    });
    return vehicleTableHtml;
}

async function loadUsers() {
    let userData = '';
    try {
        // Fetch user data from the database
        const users = await userModel.find();
        userData = users.map(user => user.toObject());
    } catch (err) {
        throw new Error('Error fetching users');
    }

    let userTableHtml = '';
    userData.forEach(user => {
        userTableHtml += `
            <tr>
                <td>${user._id}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.licenseNr}</td>
                <td>${user.loyaltyStatus}</td>
                <td><button onclick="navigate('user', ${user._id})">View</button></td>
            </tr>
        `;
    });
    return userTableHtml;
}


async function loadReservations() {
    let bookingData = '';
    let userData = '';
    let vehicleData = '';
    try {
        // Fetch booking data from the database
        const bookings = await bookingModel.find();
        bookingData = bookings.map(reservation => reservation.toObject());
    } catch (err) {
        throw new Error('Error fetching bookings');
    }

    try {
        // Fetch user data from the database
        const users = await userModel.find();
        userData = users.map(user => user.toObject());
    } catch (err) {
        throw new Error('Error fetching users');
    }

    try {
        // Fetch vehicle data from the database
        const cars = await carModel.find();
        vehicleData = cars.map(car => car.toObject());
    } catch (err) {
        throw new Error('Error fetching cars');
    }

    let bookingTableHtml = '';
    bookingData.forEach(reservation => {
        console.log(vehicleData[0]._id);
        console.log(reservation.vehicleID);
        const vehicle = vehicleData.filter(v => v._id = reservation.vehicleID);
        const user = userData.filter(u => u._id = reservation.userID);
        bookingTableHtml += `
            <tr>
                <td>${vehicle.regNr}</td>
                <td>${vehicle.make} ${vehicle.model}</td>
                <td>${user.name} ${user.surname}</td>
                <td>${formatDate(reservation.startDate)}</td>
                <td>${formatDate(reservation.returnDate)}</td>
                <td>${reservation.status}</td>
                <td><button onclick="showData('navigate', ${reservation._id})">View</button></td>
            </tr>
        `;
    });
    return bookingTableHtml;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract components of the date
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
}

module.exports = router;
