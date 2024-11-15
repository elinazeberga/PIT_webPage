const carModel = require('../models/car');
const bookingModel = require('../models/booking');
const userModel = require('../models/user');
const pages = require('../pages/pages');
const fs = require('fs').promises;  // Using fs.promises for async file reading

async function loadPage(page, param) {
    const pagePath = pages[page];
    try {
        const data = await fs.readFile(pagePath, 'utf-8');
        let htmlTemplate = data;
        // Dynamically load content based on page type
        switch (page) {
            case 'catalogue':
                return [htmlTemplate.replace('{{tableData}}', await loadCatalogue())];
            case 'reservations':
                return [htmlTemplate.replace('{{tableData}}', await loadReservations())];
            case 'users':
                return [htmlTemplate.replace('{{tableData}}', await loadUsers())];
            case 'vehicle':
                const script = await fs.readFile(pages['vehiclescript'], 'utf-8');
                return [await loadVehicle(data, param), script];
        }
        // Replace the placeholder with dynamic content
    } catch (err) {
        console.error(`Error reading page template: ${page}`, err);
        throw new Error('Error loading page template');
    }
}

async function loadVehicle(data, param) {
    const defaultFields = {
        vehicleID: "Automatically Generated",
        vehicleMake: "",
        vehicleModel: "",
        vehicleRegNr: "",
        vehicleYear: "",
        vehiclePrice: "",
        vehicleNotes: "",
        vehicleImages: ""
    };

    if (param === 'new') {
        return replaceTemplateFields(data, defaultFields);
    }

    try {
        const car = await carModel.findById(param);
        if (!car) throw new Error('Car not found');

        const fields = {
            vehicleID: param,
            vehicleMake: car.make,
            vehicleModel: car.model,
            vehicleRegNr: car.registrationNumber,
            vehicleYear: car.year,
            vehiclePrice: car.pricePerDay,
            vehicleImages: car.images.toString(),
            vehicleNotes: car.notes
        };

        // Handle select fields
        const selectFields = ['type', 'gearboxType', 'fuelType', 'status'];
        selectFields.forEach(field => {
            data = data.replace(
                `value="${car[field]}"`, 
                `value="${car[field]}" selected`
            );
        });

        return replaceTemplateFields(data, fields);
    } catch (err) {
        throw new Error('Error fetching car');
    }
}

function replaceTemplateFields(template, fields) {
    return Object.entries(fields).reduce((acc, [key, value]) => {
        return acc.replace(`{{${key}}}`, value);
    }, template);
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
                <td><img src="${(vehicle.images)[0]}" alt="Car image" width="100"></td>
                <td>${vehicle.registrationNumber}</td>
                <td>${vehicle.make} ${vehicle.model}</td>
                <td>${vehicle.status}</td>
                <td><button onclick ="location.href= './vehicle/?id=${vehicle._id}';">View</button></td>
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


module.exports = {
    loadPage
};