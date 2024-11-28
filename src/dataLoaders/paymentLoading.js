const bookingModel = require('../models/booking');
const paymentModel = require('../models/payment');
const DEFAULT_FIELDS = require('../constants/defaultFields');
const createPaymentTableRow = require('../renderers/paymentRenderer');
const {processSelectFields, replaceTemplateFields, createSelectOptions} = require('../renderers/rendererUtils');

// Load payment table content
async function loadPayments() {
    try {
        const payments = await paymentModel.find(); // Load all payments
        // Convert payments to objects, create table row for each payment, join them together
        return payments.map(payment => createPaymentTableRow(payment.toObject())).join('');
    } catch (error) {
        throw new Error(`Failed to load payments: ${error.message}`);
    }
}

// Load data for a single payment
async function loadPayment(template, param) {
    try {
        // Load bookings and their count
        const bookingCount = await bookingModel.countDocuments({});
        const bookings = await bookingModel.find();
        
        // If we are editing a payment, load it
        let payment = null;
        if (param !== 'new') {
            payment = await paymentModel.findById(param);
            if (!payment) {
                throw new Error('Payment not found');
            }
        }

        // If there are no bookings, but payment exists, it means that
        // the associated booking is deleted. 
        if (bookingCount !== 0 || param !== 'new') {
            template = createSelectOptions(template,
                payment ? payment.booking.toString() : null,
                bookings,
                'bookingList',
                booking => `${booking._id}`
            );
        } else { // Otherwise we are trying to create a payment without existing bookings
            template = template.replace(
                '{{bookingList}}', 
                `<option value="None">No bookings exist</option>`
            );
        }
        // Set default fields or existing fields
        // depending whether we are trying to create a new entry
        const fields = param === 'new' 
            ? DEFAULT_FIELDS.payment
            : {
                paymentID: param,
                paymentAmount: payment.amount,
                paymentDate: payment.paymentDate
            };
        
        // If the payment exists, process select fields to show the
        // associated values
        if (payment) {
            template = processSelectFields(template, payment, ['status', 'booking']);
        }
        
        return replaceTemplateFields(template, fields); // Replace input fields and return processed template
    } catch (err) { // Error handling
        console.error('Error processing payment template:', err);
        throw new Error('Error fetching bookings and processing payment template');
    }
}

module.exports = {loadPayments, loadPayment}