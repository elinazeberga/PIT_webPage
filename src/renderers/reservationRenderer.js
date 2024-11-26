const {formatDate} = require('../utils/dateUtils');

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
            <td><button onclick ="location.href= './reservation/?id=${booking._id}';">View</button></td>
        </tr>
    `;
}

module.exports = createReservationTableRow;