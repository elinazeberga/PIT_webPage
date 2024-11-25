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
router.post('/create', authenticateAdmin, async (req, res) => {
    try {
        const { make, model, registrationNumber, type, fuelType, gearboxType, year, pricePerDay, status, images, notes} = req.body;
        const car = new Car({ make, model, registrationNumber, type, fuelType, gearboxType, year, pricePerDay, status, images, notes });
        await car.save();
        res.status(201).send({ message: 'Car added successfully', car });
    } catch (err) {
        res.status(500).send({ message: 'Error adding car', error: err });
    }
});

router.put('/alter', authenticateAdmin, async (req, res) => {
    const { id, ...updates } = req.body; // Extract ID and other updates from the request body
    if (!id) {
        return res.status(400).send({ message: 'ID is required to update car information' });
    }
    try {
        const updatedCar = await Car.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedCar) {
            return res.status(404).send({ message: 'Car not found' });
        }
        res.send({ message: 'Car updated successfully', car: updatedCar });
    } catch (err) {
        res.status(500).send({ message: 'Error updating car', error: err });
    }
});

router.delete('/delete', authenticateAdmin, async (req, res) => {
    try {
        const {id} = req.body;
        const result = await Car.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Car not found' });
        }
        res.status(200).send({ message: 'Car deleted successfully'});
    } catch (err) {
        res.status(500).send({ message: 'Error deleting car', error: err });
    }
});
module.exports = router;
