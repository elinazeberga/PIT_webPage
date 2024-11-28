const {formatDate} = require('../utils/dateUtils');

function createReservationTableRow(booking, usersMap, vehiclesMap) { // Defines how a reservation table row should be displayed
    // Get associated data
    const vehicle = vehiclesMap.get(booking.car.toString());
    const user = usersMap.get(booking.user.toString());

    // Handle cases when vehicle or user is deleted
    const vehicleData = vehicle ?
    `<td>${vehicle.registrationNumber}</td>
    ­<td>${vehicle.make} ${vehicle.model}</td>`: 
    `<td>DELETED</td> <td>${booking.car}</td>`;

    // Handle cases when vehicle or user is deleted
    const userData = user ?
    `<td>${user.name} ${user.lastName}</td>`: 
    `<td>DELETED ${booking.user}`;
    return `
        <tr>
            ${vehicleData}
            ${userData}
            <td>${formatDate(booking.rentalStartDate)}</td>
            <td>${formatDate(booking.rentalEndDate)}</td>
            <td>${booking.status}</td>
            <td><button onclick ="location.href= './reservation/?id=${booking._id}';">View</button></td>
        </tr>
    `;
}

module.exports = createReservationTableRow;