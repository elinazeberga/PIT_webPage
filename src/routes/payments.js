const express = require('express');
const Payment = require('../models/payment');
const { update } = require('../models/user');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all payments (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const payments = await Payment.find().populate('booking');
        res.send(payments);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching payments', error: err });
    }
});

// Get payment by Booking ID
router.get('/booking/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const payment = await Payment.findOne({ booking: bookingId });
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send(payment);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching payment', error: err });
    }
});

// Create a new payment
router.post('/', async (req, res) => {
    try {
        const { bookingId, amount, status } = req.body;
        const payment = new Payment({
            booking: bookingId,
            amount,
            paymentDate: new Date(),
            status
        });
        await payment.save();
        res.status(201).send({ message: 'Payment created successfully', payment });
    } catch (err) {
        res.status(500).send({ message: 'Error creating payment', error: err });
    }
});

router.put('/alter', authenticateAdmin, async (req, res) => {
    const { id, ...updates } = req.body; // Extract ID and other updates from the request body
    if (!id) {
        return res.status(400).send({ message: 'ID is required to update payment information' });
    }
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedPayment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send({ message: 'Payment updated successfully', car: updatedPayment });
    } catch (err) {
        res.status(500).send({ message: 'Error updating payment', error: err });
    }
});

module.exports = router;
