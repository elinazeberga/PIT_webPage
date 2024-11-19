const carModel = require('../models/car');
const bookingModel = require('../models/booking');
const userModel = require('../models/user');
const pages = require('../pages/pages');
const fs = require('fs').promises;  // Using fs.promises for async file reading

const DEFAULT_FIELDS = {
    vehicle: {
        vehicleID: "Automatically Generated",
        vehicleMake: "",
        vehicleModel: "",
        vehicleRegNr: "",
        vehicleYear: "",
        vehiclePrice: "",
        vehicleNotes: "",
        vehicleImages: ""
    },
    user: {
        userID: "Automatically Generated",
        userName: "",
        userSurname: "",
        userEmail: "",
        userPhone: "",
        userLicense: ""
    },
    reservation: {
        reservationID: "Automatically Generated",
        reservationDate: "",
        reservationStart: "",
        reservationEnd: "",
        reservationPrice: ""
    }
};

async function loadPage(page, param){
    try {
        const pagePath = pages[page]; // Get template path
        if (!pagePath) {
            throw new Error(`Invalid page: ${page}`);
        }

        const htmlTemplate = await fs.readFile(pagePath, 'utf-8'); // Load template
        return await processPage(page, htmlTemplate, param);
    } catch (error) {
        console.error(`Error loading page: ${page}`, error);
        throw new Error(`Failed to load page: ${error.message}`);
    }
}

async function processPage(page, template, param) {
    const pageHandlers = {
        catalogue: async () => [template.replace('{{tableData}}', await loadCatalogue())],
        vehicle: async () => {
            const vehicleScript = await fs.readFile(pages['vehiclescript'], 'utf-8');
            return [await loadVehicle(template, param), vehicleScript];
        },
        reservations: async () => [template.replace('{{tableData}}', await loadReservations())],
        reservation: async () => {
            const reservationScript = await fs.readFile(pages['reservationscript'], 'utf-8');
            return [await loadReservation(template, param), reservationScript];
        },
        users: async () => [template.replace('{{tableData}}', await loadUsers())],
        user: async () => {
            const userScript = await fs.readFile(pages['userscript'], 'utf-8');
            return [await loadUser(template, param), userScript];
        },
        home: async() => [template]
    };

    const handler = pageHandlers[page];
    if (!handler) {
        throw new Error(`No handler found for page: ${page}`);
    }

    return handler();
};

async function loadCatalogue() {
    let vehicleData = '';
    try {
        // Fetch vehicle data from the database
        const cars = await carModel.find();
        return cars.map(car => createVehicleTableRow(car.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load catalogue: ${error.message}`);
    }
}

function createVehicleTableRow(vehicle) {
    return `
        <tr>
            <td><img src="${vehicle.images[0]}" alt="Car image" width="100"></td>
            <td>${vehicle.registrationNumber}</td>
            <td>${vehicle.make} ${vehicle.model}</td>
            <td>${vehicle.status}</td>
            <td><button onclick="location.href='./vehicle/?id=${vehicle._id}';">View</button></td>
        </tr>
    `;
}

async function loadVehicle(template, param) {
    if (param === 'new') {
        return replaceTemplateFields(template, DEFAULT_FIELDS.vehicle);
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

        template = processSelectFields(template, car, ['type', 'gearboxType', 'fuelType', 'status']);
        return replaceTemplateFields(template, fields);
    } catch (err) {
        throw new Error('Error fetching car');
    }
}

function processSelectFields(template, data, fields) {
    fields.forEach(element => {
        template = template.replace(
            `value="${data[element]}"`,
            `value="${data[element]}" selected`
        );
    });
    return template;
}

function replaceTemplateFields(template, fields) {
    return Object.entries(fields).reduce((acc, [key, value]) => {
        return acc.replace(`{{${key}}}`, value);
    }, template);
}

async function loadUsers() {
    try {
        const users = await userModel.find();
        return users.map(user => createUserTableRow(user.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load users: ${error.message}`);
    }
}

function createUserTableRow(user) {
    return `
        <tr>
            <td>${user._id}</td>
            <td>${user.name}</td>
            <td>${user.lastName}</td>
            <td>${user.loyalty}</td>
            <td><button onclick ="location.href= './user/?id=${user._id}';">View</button></td>
        </tr>
    `;
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

        processSelectFields(template, user, ['role', 'loyalty']);
        return replaceTemplateFields(template, fields);
    } catch (error) {
        throw new Error(`Failed to load user: ${error.message}`);
    }
}

async function loadReservations() {
    try {
        const [bookings, users, vehicles] = await Promise.all([
            bookingModel.find(),
            userModel.find(),
            carModel.find()
        ]);

        const usersMap = new Map(users.map(user => [user._id.toString(), user.toObject()]));
        const vehiclesMap = new Map(vehicles.map(vehicle => [vehicle._id.toString(), vehicle.toObject()]));

        return bookings
            .map(booking => createReservationTableRow(booking.toObject(), usersMap, vehiclesMap))
            .join('');
    } catch (error) {
        throw new Error(`Failed to load reservations: ${error.message}`);
    }
}

function createReservationTableRow(booking, usersMap, vehiclesMap) {
    const vehicle = vehiclesMap.get(booking.car.toString());
    const user = usersMap.get(booking.user.toString());

    if (!vehicle || !user) {
        console.error('Missing vehicle or user data for reservation:', booking._id);
        return '';
    }

    return `
        <tr>
            <td>${vehicle.registrationNumber}</td>
            <td>${vehicle.make} ${vehicle.model}</td>
            <td>${user.name} ${user.lastName}</td>
            <td>${formatDate(booking.rentalStartDate)}</td>
            <td>${formatDate(booking.rentalEndDate)}</td>
            <td>${booking.status}</td>
            <td><button onclick="showData('navigate', '${booking._id}')">View</button></td>
        </tr>
    `;
}

async function loadReservation(template, param) {
    try {
        const [users, vehicles] = await Promise.all([
            userModel.find(),
            carModel.find()
        ]);

        template = createSelectOptions(template, users, 'renterList', user => 
            `${user.email} - ${user.name} ${user.lastName}`
        );

        template = createSelectOptions(template, vehicles, 'vehicleList', vehicle => 
            `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}`
        );

        if (param === 'new') {
            return replaceTemplateFields(template, DEFAULT_FIELDS.reservation);
        }

        const reservation = await bookingModel.findById(param);
        if (!reservation) {
            throw new Error('Reservation not found');
        }

        const fields = {
            reservationID: param,
            reservationDate: reservation.reservationDate,
            reservationStart: reservation.rentalStartDate,
            reservationEnd: reservation.rentalEndDate,
            reservationPrice: reservation.totalPrice
        };

        processSelectFields(template, reservation, ['status']);
        return replaceTemplateFields(template, fields);
    } catch (error) {
        throw new Error(`Failed to load reservation: ${error.message}`);
    }
}

function createSelectOptions(template, items, placeholder, labelFn) {
    const options = items
        .map(item => `<option value="${item._id}">${labelFn(item)}</option>`)
        .join('');
    return template.replace(`{{${placeholder}}}`, options);
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