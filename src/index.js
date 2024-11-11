const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Host static website
app.use(express.static(path.join(__dirname, '../ui')));

// Set the strictQuery option
mongoose.set('strictQuery', true);

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

if (process.env.NODE_ENV !== 'test') {
    // Start the server
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

module.exports = app;
