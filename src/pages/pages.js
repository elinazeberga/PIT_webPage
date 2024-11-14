// pages.js
const path = require('path');

module.exports = {
    home: path.join(__dirname, 'home.html'),
    catalog: path.join(__dirname, 'vehicle','catalog.html'),
    reservationlist: path.join(__dirname, 'reservation-list.html'),
    reservation: path.join(__dirname, 'reservation.html'),
    userlist: path.join(__dirname, 'user-list.html'),
    user: path.join(__dirname, 'user.html'),
    vehicle: path.join(__dirname, 'vehicle', 'vehicle.html'),
    newvehicle: path.join(__dirname, 'vehicle', 'newvehicle.html'),
    newvehiclescript: path.join(__dirname, 'vehicle', 'newvehiclescript.js')
};