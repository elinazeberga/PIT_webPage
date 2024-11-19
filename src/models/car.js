const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true},
    type: { type: String, enum: ['Compact', 'Estate', 'Sedan', 'SUV', 'Luxury'], required: true, default: 'Compact'},
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric'], required: true, default: 'Petrol'},
    gearboxType: { type: String, enum: ['Manual', 'Automatic'], required: true, default: 'Automatic'},
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'In Use', 'In Service', 'Requires Inspection'], default: 'Available' },
    images: { type: [String], default: []},
    notes: { type: String, required: false }
});

module.exports = mongoose.model('Car', CarSchema);
