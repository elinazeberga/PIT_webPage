function createPaymentTableRow(payment) { //Defines how a payment table row should be displayed
    return `
        <tr>
            <td>${payment.booking}</td>
            <td>${payment.amount}</td>
            <td>${payment.paymentDate}</td>
            <td>${payment.status}</td>
            <td><button onclick="location.href='./payment/?id=${payment._id}';">View</button></td>
        </tr>
    `;
}

module.exports = createPaymentTableRow;