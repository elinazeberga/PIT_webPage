const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    status: { type: String, enum: ['Successful', 'Failed', 'Pending'], default: 'pending' }
});

module.exports = mongoose.model('Payment', PaymentSchema);
