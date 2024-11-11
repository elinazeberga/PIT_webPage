const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');

describe('Auth Routes', () => {
    const generateUserData = () => ({
        username: `testuser_${Date.now()}`,
        password: `password_${Date.now()}`,
        email: `email_${Date.now()}@example.com`,
        fullname: 'Test User',
        phone: '1234567890'
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a user', async () => {
        const userData = generateUserData();
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
    });

    it('should login a user', async () => {
        const userData = generateUserData();
        const user = new User(userData);
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: userData.username, password: userData.password });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
