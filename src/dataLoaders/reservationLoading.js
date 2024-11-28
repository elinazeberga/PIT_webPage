const carModel = require('../models/car');
const bookingModel = require('../models/booking');
const userModel = require('../models/user');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createReservationTableRow = require('../renderers/reservationRenderer');
const {processSelectFields, replaceTemplateFields, createSelectOptions} = require('../renderers/rendererUtils');
const {parseDate} = require('../utils/dateUtils');

// Load reservation table content
async function loadReservations() {
    try {
        // Load all associated info
        const [bookings, users, vehicles] = await Promise.all([
            bookingModel.find(),
            userModel.find(),
            carModel.find()
        ]);
        // Convert vehicles and users to map
        const usersMap = new Map(users.map(user => [user._id.toString(), user.toObject()]));
        const vehiclesMap = new Map(vehicles.map(vehicle => [vehicle._id.toString(), vehicle.toObject()]));
        // Create rows for each booking and join them together.
        return bookings
            .map(booking => createReservationTableRow(booking.toObject(), usersMap, vehiclesMap))
            .join('');
    } catch (error) {
        throw new Error(`Failed to load reservations: ${error.message}`);
    }
}

async function loadReservation(template, param) {
    try {
        // Load all associated info and their counts
        const [usersCount, vehiclesCount] = await Promise.all([
            userModel.countDocuments({}),
            carModel.countDocuments({})
        ]);

        const [users, vehicles] = await Promise.all([
            userModel.find(),
            carModel.find()
        ]);
        
        // If we are editing a reservation, load it
        let reservation = null;
        if (param !== 'new') {
            reservation = await bookingModel.findById(param);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
        }
        
        // If there are no users, but reservation exists,
        // it means that the associated user is deleted. 
        if (usersCount !== 0 || param !== 'new') {
            template = createSelectOptions(template,
                reservation ? reservation.user.toString() : null,
                users,
                'renterList',
                user => 
                `${user.email} - ${user.name} ${user.lastName}`
            );    
        } else { // Otherwise we are trying to create a reservation without existing users
            template = template.replace(
                '{{renterList}}', 
                `<option value="None">No users exist</option>`
            );
        }
        // If there are no vehicles, but reservation exists,
        // it means that the associated vehicle is deleted. 
        if (vehiclesCount !== 0 || param !== 'new') {
            template = createSelectOptions(template,
                reservation ? reservation.car.toString() : null,
                vehicles,
                'vehicleList',
                vehicle => 
                `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}`
            );    
        } else { // Otherwise we are trying to create a reservation without existing vehicles
            template = template.replace(
                '{{vehicleList}}', 
                `<option value="None">No vehicles exist</option>`
            );
        }
        // Set default fields or existing fields
        // depending whether we are trying to create a new entry
        const fields = param === 'new' 
            ? DEFAULT_FIELDS.reservation
            : {
                reservationID: param,
                reservationDate: parseDate(reservation.reservationDate),
                reservationStart: parseDate(reservation.rentalStartDate),
                reservationEnd: parseDate(reservation.rentalEndDate),
                reservationPrice: reservation.totalPrice
            };
        // If the reservation exists,
        // process select fields to show the associated values
        if (reservation) {
            template = processSelectFields(template, reservation, ['status', 'user', 'car']);
        }
    
        return replaceTemplateFields(template, fields); // Replace input fields and return processed template
    } catch (error) { // Error handling
        console.error(error);
        throw new Error(`Failed to load reservation: ${error.message}`);
    }
}

module.exports = {loadReservations, loadReservation};