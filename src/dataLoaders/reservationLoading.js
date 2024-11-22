const carModel = require('../models/car');
const bookingModel = require('../models/booking');
const userModel = require('../models/user');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createReservationTableRow = require('../renderers/reservationRenderer');
const {processSelectFields, replaceTemplateFields, createSelectOptions} = require('../renderers/rendererUtils');
const {parseDate} = require('../utils/dateUtils');
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
            reservationDate: parseDate(reservation.reservationDate),
            reservationStart: parseDate(reservation.rentalStartDate),
            reservationEnd: parseDate(reservation.rentalEndDate),
            reservationPrice: reservation.totalPrice
        };
        template = processSelectFields(template, reservation, ['status', 'user', 'car']);
        return replaceTemplateFields(template, fields);
    } catch (error) {
        throw new Error(`Failed to load reservation: ${error.message}`);
    }
}

module.exports = {loadReservations, loadReservation};