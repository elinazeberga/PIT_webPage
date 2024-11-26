const bookingModel = require('../models/booking');
const paymentModel = require('../models/payment');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createPaymentTableRow = require('../renderers/paymentRenderer');
const {processSelectFields, replaceTemplateFields, createSelectOptions} = require('../renderers/rendererUtils');

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
        const bookingCount = await bookingModel.countDocuments({});
        const bookings = await bookingModel.find();
        
        let payment = null;
        if (param !== 'new') {
            payment = await paymentModel.findById(param);
            if (!payment) {
                throw new Error('Payment not found');
            }
        }

        if (bookingCount !== 0 || param !== 'new') {
            template = createSelectOptions(template,
                payment ? payment.booking.toString() : null,
                bookings,
                'bookingList',
                booking => `${booking._id}`
            );
        } else {
            template = template.replace(
                '{{bookingList}}', 
                `<option value="None">No bookings exist</option>`
            );
        }
    
        const fields = param === 'new' 
            ? DEFAULT_FIELDS.payment
            : {
                paymentID: param,
                paymentAmount: payment.amount,
                paymentDate: payment.paymentDate
            };
    
        if (payment) {
            template = processSelectFields(template, payment, ['status', 'booking']);
        }
    
        return replaceTemplateFields(template, fields);
    } catch (err) {
        console.error('Error processing payment template:', err);
        throw new Error('Error fetching bookings and processing payment template');
    }
}

module.exports = {loadPayments, loadPayment}