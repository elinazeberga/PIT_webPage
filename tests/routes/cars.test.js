const request = require('supertest');
const app = require('../../src/index');
const Car = require('../../src/models/car');
const User = require('../../src/models/user');

describe('Car Routes', () => {
    let adminToken;
    let carId;

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

    beforeAll(async () => {
        await User.deleteMany({});
        await Car.deleteMany({});

        // Register and login an admin user
        const adminData = generateAdminData();
        const adminRegisterRes = await request(app).post('/api/auth/register').send(adminData);
        expect(adminRegisterRes.statusCode).toBe(201);

        const adminLoginRes = await request(app).post('/api/auth/login').send({ email: adminData.email, password: adminData.password });
        expect(adminLoginRes.statusCode).toBe(200);

        adminToken = adminLoginRes.body.token;
        adminUserId = adminLoginRes.body.userId;
    });

    it('Test: add car', async () => {
        const carData = generateCarData();

        const res = await request(app)
            .post('/api/cars/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(carData);

        carId = res.body.car._id;

        console.log("Add car response: ", res.body);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Car added successfully');
        expect(res.body.car).toHaveProperty('_id');
        expect(res.body.car).toMatchObject({
            make: carData.make,
            model: carData.model,
            registrationNumber: carData.registrationNumber,
            type: carData.type,
            fuelType: carData.fuelType,
            gearboxType: carData.gearboxType,
            year: carData.year,
            pricePerDay: carData.pricePerDay,
            status: carData.status,
            images: carData.images,
            notes: carData.notes
        });
    });

    it('Test: get all cars', async () => {
        const res = await request(app).get('/api/cars');

        console.log("Get all cars response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('make');
        expect(res.body[0]).toHaveProperty('model');
    });

    it('Test: update car', async () => {
        const updates = { pricePerDay: 50 };

        const res = await request(app)
            .put('/api/cars/alter')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id: carId, ...updates });

        console.log("Update car response: ", res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Car updated successfully');
        expect(res.body.car.pricePerDay).toEqual(updates.pricePerDay);
    });

    it('Test: delete car', async () => {
        const res = await request(app)
            .delete('/api/cars/delete')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id: carId });

        console.log("Delete car response: ", JSON.stringify(res.body));

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Car deleted successfully');
    });
});