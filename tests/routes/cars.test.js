const request = require('supertest');
const app = require('../../src/index');
const Car = require('../../src/models/car');
const User = require('../../src/models/user');

describe('Car Routes', () => {
    let adminToken;

    const carData = { make: 'Toyota', model: 'Corolla', year: 2020, pricePerDay: 40 };
    const adminData = {
        username: `admin_${Date.now()}`,
        password: 'adminpassword',
        email: `admin_${Date.now()}@example.com`,
        fullname: 'Admin User',
        phone: '1234567890',
        role: 'admin'
    };

    beforeEach(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        // Login admin user
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: adminData.username, password: adminData.password });

        adminToken = res.body.token;
    });

    it('should add a car', async () => {
        const res = await request(app)
            .post('/api/cars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(carData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Car added successfully');
    });

    it('should get all cars', async () => {
        const car = new Car(carData);
        await car.save();

        const res = await request(app).get('/api/cars');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
