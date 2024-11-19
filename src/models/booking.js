const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    reservationDate: { type: Date, required: true },
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'In-Progress', 'Cancelled', 'Completed'], default: 'Pending' }
});

module.exports = mongoose.model('Booking', BookingSchema);
