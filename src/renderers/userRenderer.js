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

module.exports = createUserTableRow;