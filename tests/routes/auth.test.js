const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user');

describe('Auth Routes', () => {
    let adminToken, userToken;
    let userId, adminUserId;

    const generateUserData = () => ({
        name: `testuser_${Date.now()}`,
        lastName: `lastname_${Date.now()}`,
        password: `password_${Date.now()}`,
        email: `email_${Date.now()}@example.com`,
        licenseNr: `license_${Date.now()}`,
        loyalty: 'Bronze',
        phone: '1234567890',
        role: 'User'
    });

    const generateAdminData = () => ({
        name: `admin_${Date.now()}`,
        lastName: `admin_lastname_${Date.now()}`,
        password: `admin_password_${Date.now()}`,
        email: `admin_${Date.now()}@example.com`,
        licenseNr: `admin_license_${Date.now()}`,
        loyalty: 'Bronze',
        phone: '0987654321',
        role: 'Admin'
    });

    beforeAll(async () => {
        await User.deleteMany({});

        // Register an admin user
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
    });

    it('Test: register user', async () => {
        const userData = generateUserData();
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        console.log("Get register user response: ", res.body)

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
    });

    it('Test: login user', async () => {
        const userData = generateUserData();
        const user = new User(userData);
        await user.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });

        console.log("Get login user response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Test: get user data', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${userToken}`);

        console.log("Get user data response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Got user profile');
    });

    it('Test: alter user data', async () => {
        const newData = {
            id: userId,
            name: 'Updated Name',
            email: 'updated_email@example.com'
        };

        const res = await request(app)
            .put('/api/auth/alter')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newData);

        console.log("Get alter user response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User updated successfully');
        expect(res.body.User.name).toEqual('Updated Name');
        expect(res.body.User.email).toEqual('updated_email@example.com');
    });

    it('Test: delete user', async () => {
        const res = await request(app)
            .delete('/api/auth/delete')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ id: userId });

        console.log("Get delete user response: ", res.body)

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User deleted successfully');
    });

    afterAll(async () => {
        await User.deleteMany({});
    });
});
