const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { authenticateAdmin, authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user data
router.get('/profile/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password');
        res.status(200).send({ message: 'Got user profile', User: user });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching user details', error: err });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, lastName, password, email, licenseNr, loyalty, phone, role } = req.body;
        const user = new User({ name, lastName, password, email, licenseNr, loyalty, phone, role });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error registering user', error: err });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token, userId: user._id });
    } catch (err) {
        res.status(500).send({ message: 'Error logging in', error: err });
    }
});

router.put('/alter', authenticateAdmin, async (req, res) => {
    const { id, ...updates } = req.body; // Extract ID and other updates from the request body
    if (!id) {
        return res.status(400).send({ message: 'ID is required to update user information' });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User updated successfully', User: updatedUser });
    } catch (err) {
        res.status(500).send({ message: 'Error updating user', error: err });
    }
});

router.delete('/delete', authenticateAdmin, async (req, res) => {
    try {
        const {id} = req.body;
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully'});
    } catch (err) {
        res.status(500).send({ message: 'Error deleting user', error: err });
    }
});
module.exports = router;
