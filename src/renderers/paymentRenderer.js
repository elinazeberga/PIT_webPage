function createPaymentTableRow(payment) {
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