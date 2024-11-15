// pages.js
const path = require('path');

module.exports = {
    home: path.join(__dirname, 'home.html'),
    catalogue: path.join(__dirname, 'vehicle','catalog.html'),
    reservations: path.join(__dirname, 'reservation-list.html'),
    reservation: path.join(__dirname, 'reservation.html'),
    users: path.join(__dirname, 'user-list.html'),
    user: path.join(__dirname, 'user.html'),
    vehicle: path.join(__dirname, 'vehicle', 'vehicle.html'),
    vehiclescript: path.join(__dirname, 'vehicle', 'vehiclescript.js')
};