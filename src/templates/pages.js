// pages.js
const path = require('path');

module.exports = {
    home: path.join(__dirname, 'home.html'),
    navigation: path.join(__dirname, 'nav.html'),

    reservations: path.join(__dirname, 'reservation', 'reservation-list.html'),
    reservation: path.join(__dirname, 'reservation', 'reservation.html'),
    reservationscript: path.join(__dirname, 'reservation', 'reservationscript.js'),

    users: path.join(__dirname, 'user', 'user-list.html'),
    user: path.join(__dirname, 'user', 'user.html'),
    userscript: path.join(__dirname, 'user', 'userscript.js'),

    catalogue: path.join(__dirname, 'vehicle','catalog.html'),
    vehicle: path.join(__dirname, 'vehicle', 'vehicle.html'),
    vehiclescript: path.join(__dirname, 'vehicle', 'vehiclescript.js'),

    payments: path.join(__dirname, 'payment','payments.html'),
    payment: path.join(__dirname, 'payment', 'payment.html'),
    paymentscript: path.join(__dirname, 'payment', 'paymentscript.js')
};