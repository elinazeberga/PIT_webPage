const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');
const Car = require('../../src/models/car');
const Booking = require('../../src/models/booking');

describe('Booking Routes', () => {
    let userToken, adminToken;
    let userId, carId;

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

        carId = carRes.body.car._id;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});
        await Booking.deleteMany({});
    });

    it('Test: create booking', async () => {
        const res = await request(app)
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ userId, carId, ...bookingData });

        console.log("Create booking response: " + res.body.message)

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Booking created successfully');
    });

    it('Test: get all bookings', async () => {
        const res = await request(app).get('/api/bookings').set('Authorization', `Bearer ${adminToken}`);

        console.log("Get all bookings response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Test: get bookings for specific user', async () => {
        const res = await request(app).get(`/api/bookings/user/${userId}`).set('Authorization', `Bearer ${userToken}`);

        console.log("Get user booking response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Test: get specific booking by ID', async () => {
        const booking = await Booking.findOne({ user: userId });

        const res = await request(app).get(`/api/bookings/${booking._id}`).set('Authorization', `Bearer ${userToken}`);

        console.log("Get booking by ID response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', booking._id.toString());
    });

    it('Test: update booking', async () => {
        const booking = await Booking.findOne({ user: userId });
        const updates = { status: 'Confirmed' };

        const res = await request(app)
            .put('/api/bookings/alter')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ id: booking._id, ...updates });

        console.log("Alter booking response: " + res.body.message)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Booking updated successfully');
        expect(res.body.Booking.status).toEqual('Confirmed');
    });

    it('Test: delete booking', async () => {
        const booking = await Booking.findOne({ user: userId });

        const res = await request(app)
            .delete('/api/bookings/delete')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ id: booking._id });

        console.log("Delete booking response: " + res.body.message)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Booking deleted successfully');
    });
});
