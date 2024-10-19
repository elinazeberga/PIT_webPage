const request = require('supertest');
const app = require('../../src/index');
const Car = require('../../src/models/car');

describe('Car Routes', () => {
    const carData = { make: 'Toyota', model: 'Corolla', year: 2020, pricePerDay: 40 };

    it('should add a car', async () => {
        const res = await request(app)
            .post('/api/cars')
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
