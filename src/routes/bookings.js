const express = require('express');
const Booking = require('../models/booking');
const Car = require('../models/car');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all bookings (admin only)
router.get('/', authenticateUser, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user car');
        res.send(bookings);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching bookings', error: err });
    }
});

// Get bookings for a specific user
router.get('/user/:userId', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ user: userId }).populate('car');
        res.send(bookings);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching user bookings', error: err });
    }
});

// Get a specific booking by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('user car');
        if (!booking) {
            return res.status(404).send({ message: 'Booking not found' });
        }
        res.send(booking);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching booking', error: err });
    }
});

// Create a new booking
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { userId, carId, rentalStartDate, rentalEndDate, status } = req.body;
        
        // Find the car and calculate total price
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).send({ message: 'Car not found' });
        }

        const rentalDays = Math.ceil((new Date(rentalEndDate).getTime() - new Date(rentalStartDate).getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = rentalDays * car.pricePerDay;

        // Create a booking
        const booking = new Booking({
            user,
            car,
            reservationDate: new Date(),
            rentalStartDate,
            rentalEndDate,
            totalPrice,
            status
        });

        await booking.save();
        res.status(201).send({ message: 'Booking created successfully', booking });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error creating booking', error: err });
    }
});

router.put('/alter', authenticateAdmin, async (req, res) => {
    const { id, ...updates } = req.body; // Extract ID and other updates from the request body
    if (!id) {
        console.log(id);
        return res.status(400).send({ message: 'ID is required to update booking information' });
    }
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedBooking) {
            return res.status(404).send({ message: 'Booking not found' });
        }
        res.send({ message: 'Booking updated successfully', Booking: updatedBooking });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error updating Booking', error: err });
    }
});

module.exports = router;
