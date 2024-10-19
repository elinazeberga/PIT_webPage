const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

describe('Auth Routes', () => {
    const userData = { username: Math.random().toString(36), password: Math.random().toString(36) };

    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
    });

    it('should login a user', async () => {
        await sleep(100)

        const user = new User(userData);
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send(userData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
