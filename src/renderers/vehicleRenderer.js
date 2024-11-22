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

module.exports = createVehicleTableRow;