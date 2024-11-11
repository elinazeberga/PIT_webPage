const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, fullname, phone, role } = req.body;
        const user = new User({ username, password, email, fullname, phone, role });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error registering user', error: err });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token, userId: user._id });
    } catch (err) {
        res.status(500).send({ message: 'Error logging in', error: err });
    }
});

module.exports = router;
