// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../ui')));

mongoose.set('strictQuery', true);

const mongoDbUri = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.MONGODB_URI;
mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to the ${process.env.NODE_ENV} database`))
    .catch(err => console.error(`Error connecting to ${process.env.NODE_ENV} database:`, err));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

module.exports = app;