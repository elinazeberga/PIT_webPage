const bookingModel = require('../models/booking');
const paymentModel = require('../models/payment');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createPaymentTableRow = require('../renderers/paymentRenderer');
const {processSelectFields, replaceTemplateFields} = require('../renderers/rendererUtils');

async function loadPayments() {
    try {
        const payments = await paymentModel.find();
        return payments.map(payment => createPaymentTableRow(payment.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load payments: ${error.message}`);
    }
}

async function loadPayment(template, param) {
    try {
        const bookings = await bookingModel.find();

        template = createSelectOptions(template, bookings, 'bookingList', booking => 
            `${booking._id}`
        );

        if (param === 'new') {
            return replaceTemplateFields(template, DEFAULT_FIELDS.payment);
        }

        const payment = await paymentModel.findById(param);
        if (!payment) throw new Error('Payment not found');

        const fields = {
            paymentID: param,
            paymentAmount: payment.amount,
            paymentDate: payment.paymentDate
        };

        template = processSelectFields(template, payment, ['status', 'booking']);
        return replaceTemplateFields(template, fields);
    } catch (err) {
        throw new Error('Error fetching booking');
    }
}

module.exports = {loadPayments, loadPayment}