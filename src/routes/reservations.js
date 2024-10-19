const express = require('express');
const Car = require('../models/car');
const User = require('../models/user');

const router = express.Router();

// Make a reservation
router.post('/', async (req, res) => {
    try {
        const { userId, carId, startDate, endDate } = req.body;
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).send({ message: 'Car not found' });
        }
        const reservation = {
            carId,
            startDate,
            endDate,
            cost: car.pricePerDay * (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        };
        const user = await User.findByIdAndUpdate(userId, { $push: { reservations: reservation } }, { new: true });
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error making reservation', error: err });
    }
});

module.exports = router;
