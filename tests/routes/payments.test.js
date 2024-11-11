const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');
const Car = require('../../src/models/car');
const Booking = require('../../src/models/booking');
const Payment = require('../../src/models/payment');

describe('Payment Routes', () => {
    let userToken, adminToken;
    let userId, carId, bookingId;

    const generateUserData = () => ({
        username: `testuser_${Date.now().toString()}`,
        password: `password_${Date.now().toString()}`,
        email: `email_${Date.now()}@example.com`,
        fullname: 'Test User',
        phone: '1234567890'
    });

    const generateAdminData = () => ({
        username: `admin_${Date.now().toString()}`,
        password: `adminpassword_${Date.now().toString()}`,
        email: `admin_${Date.now()}@example.com`,
        fullname: 'Admin User',
        phone: '1234567890',
        role: 'admin'
    });

    const carData = { make: 'Toyota', model: 'Corolla', year: 2020, pricePerDay: 40 };
    const bookingData = {
        rentalStartDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        rentalEndDate: new Date(new Date().setDate(new Date().getDate() + 3))
    };
    const paymentData = { amount: 80, status: 'successful' };

    beforeAll(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});
        await Booking.deleteMany({});
        await Payment.deleteMany({});

        // Register and login a user
        const userData = generateUserData();
        const userRegisterRes = await request(app).post('/api/auth/register').send(userData);
        expect(userRegisterRes.statusCode).toBe(201);

        const userLoginRes = await request(app).post('/api/auth/login').send({ username: userData.username, password: userData.password });
        expect(userLoginRes.statusCode).toBe(200);

        userToken = userLoginRes.body.token;
        userId = userLoginRes.body.userId;

        // Register and login an admin user
        const adminData = generateAdminData();
        console.log("Admin registration data:", adminData);

        const adminRegisterRes = await request(app).post('/api/auth/register').send(adminData);
        expect(adminRegisterRes.statusCode).toBe(201);

        const adminUser = await User.findOne({ username: adminData.username });
        console.log("Admin user from DB:", adminUser);

        const adminLoginRes = await request(app).post('/api/auth/login').send({ username: adminData.username, password: adminData.password });
        expect(adminLoginRes.statusCode).toBe(200);

        adminToken = adminLoginRes.body.token;

        // Add a car using the admin token
        const carRes = await request(app).post('/api/cars').set('Authorization', `Bearer ${adminToken}`).send(carData);
        console.log("Car creation response:", carRes.body);

        // Extract car ID from response
        if (Array.isArray(carRes.body) && carRes.body.length > 0) {
            carId = carRes.body[0]._id;
        } else if (carRes.body._id) {
            carId = carRes.body._id;
        } else if (carRes.body.car && carRes.body.car._id) {
            carId = carRes.body.car._id;
        } else {
            throw new Error("Car creation failed");
        }

        // Create a booking
        const bookingRes = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ userId, carId, ...bookingData });
            
        if (Array.isArray(bookingRes.body) && bookingRes.body.length > 0) {
            bookingId = bookingRes.body[0]._id;
        } else if (bookingRes.body._id) {
            bookingId = bookingRes.body._id;
        } else if (bookingRes.body.booking && bookingRes.body.booking._id) {
            bookingId = bookingRes.body.booking._id;
        } else {
            throw new Error("Booking creation failed");
        }
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});
        await Booking.deleteMany({});
        await Payment.deleteMany({});
    });

    it('should create a payment', async () => {
        const res = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ bookingId, ...paymentData });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Payment created successfully');
    });

    it('should get all payments', async () => {
        const res = await request(app).get('/api/payments').set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get payment by booking ID', async () => {
        const res = await request(app).get(`/api/payments/booking/${bookingId}`).set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('booking', bookingId.toString());
    });
});
