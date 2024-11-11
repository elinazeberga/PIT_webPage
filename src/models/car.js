const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' }
});

module.exports = mongoose.model('Car', CarSchema);
