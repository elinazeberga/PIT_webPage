const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');
const Car = require('../../src/models/car');
const Booking = require('../../src/models/booking');
const Payment = require('../../src/models/payment');

describe('Payment Routes', () => {
    let userToken, adminToken;
    let userId, bookingId, paymentId;

    const generateUserData = () => ({
        name: `testuser_${Date.now().toString()}`,
        lastName: `lastname_${Date.now().toString()}`,
        password: `password_${Date.now().toString()}`,
        email: `email_${Date.now()}@example.com`,
        licenseNr: `license_${Date.now()}`,
        loyalty: 'Bronze',
        phone: '1234567890',
        role: 'User'
    });

    const generateAdminData = () => ({
        name: `admin_${Date.now().toString()}`,
        lastName: `admin_lastname_${Date.now().toString()}`,
        password: `adminpassword_${Date.now().toString()}`,
        email: `admin_${Date.now()}@example.com`,
        licenseNr: `admin_license_${Date.now()}`,
        loyalty: 'Gold',
        phone: '0987654321',
        role: 'Admin'
    });

    const generateCarData = () => ({
        make: 'Toyota',
        model: 'Corolla',
        registrationNumber: `reg_${Date.now()}`,
        type: 'Sedan',
        fuelType: 'Petrol',
        gearboxType: 'Automatic',
        year: 2020,
        pricePerDay: 40,
        status: 'Available',
        images: [],
        notes: 'A well-maintained vehicle'
    });

    let bookingData = {
        rentalStartDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        rentalEndDate: new Date(new Date().setDate(new Date().getDate() + 3))
    };

    beforeAll(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});
        await Booking.deleteMany({});
        await Payment.deleteMany({});

        // Register and login an admin user
        const adminData = generateAdminData();
        const adminRegisterRes = await request(app).post('/api/auth/register').send(adminData);
        expect(adminRegisterRes.statusCode).toBe(201);

        const adminLoginRes = await request(app).post('/api/auth/login').send({ email: adminData.email, password: adminData.password });
        expect(adminLoginRes.statusCode).toBe(200);

        adminToken = adminLoginRes.body.token;
        adminUserId = adminLoginRes.body.userId;

        // Register and login a normal user
        const userData = generateUserData();
        const userRegisterRes = await request(app).post('/api/auth/register').send(userData);
        expect(userRegisterRes.statusCode).toBe(201);

        const userLoginRes = await request(app).post('/api/auth/login').send({ email: userData.email, password: userData.password });
        expect(userLoginRes.statusCode).toBe(200);

        userToken = userLoginRes.body.token;
        userId = userLoginRes.body.userId;

        // Add a car using the admin token
        const carData = generateCarData();
        const carRes = await request(app).post('/api/cars/create').set('Authorization', `Bearer ${adminToken}`).send(carData);
        expect(carRes.statusCode).toBe(201);

        const carId = carRes.body.car._id;
        
        console.log("Add car response: ", carRes.body);

        // Create a booking
        const bookingRes = await request(app).post('/api/bookings/create').set('Authorization', `Bearer ${userToken}`).send({ ...bookingData, carId, userId });
        expect(bookingRes.statusCode).toBe(201);

        bookingId = bookingRes.body.booking._id;

        console.log("Create booking response: ", bookingRes.body);
    });

    it('Test: create payment', async () => {
        const paymentData = {
            bookingId,
            amount: 120,
            status: 'Successful'
        };

        const res = await request(app)
            .post('/api/payments/create')
            .set('Authorization', `Bearer ${userToken}`)
            .send(paymentData);

        paymentId = res.body.payment._id;

        console.log("Create payment response: ", res.body);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Payment created successfully');
        expect(res.body.payment).toHaveProperty('_id');
        expect(res.body.payment.amount).toEqual(paymentData.amount);
    });

    it('Test: get all payments (admin only)', async () => {
        const res = await request(app).get('/api/payments').set('Authorization', `Bearer ${adminToken}`);

        console.log("Get all payments response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('booking');
    });

    it('Test: get payment by Booking ID', async () => {
        const res = await request(app).get(`/api/payments/booking/${bookingId}`).set('Authorization', `Bearer ${userToken}`);

        console.log("Get payment by booking ID response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.booking.toString()).toEqual(bookingId.toString());
    });

    it('Test: update payment (admin only)', async () => {
        const updates = { status: 'Failed' };

        const res = await request(app)
            .put('/api/payments/alter')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id: paymentId, ...updates });

        console.log("Update payment response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Payment updated successfully');
        expect(res.body.car.status).toEqual(updates.status);
    });

    it('Test: delete payment (admin only)', async () => {
        const res = await request(app)
            .delete('/api/payments/delete')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id: paymentId });

        console.log("Delete payment response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Payment deleted successfully');
    });
});
