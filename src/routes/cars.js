const express = require('express');
const Car = require('../models/car');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.send(cars);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching cars', error: err });
    }
});

// Add a new car (admin only)
router.post('/', async (req, res) => {
    try {
        const { make, model, registrationNumber, type, fuelType, gearboxType, year, pricePerDay, status, images, notes} = req.body;
        const car = new Car({ make, model, registrationNumber, type, fuelType, gearboxType, year, pricePerDay, status, images, notes });
        await car.save();
        res.status(201).send({ message: 'Car added successfully', car });
    } catch (err) {
        res.status(500).send({ message: 'Error adding car', error: err });
    }
});

module.exports = router;
