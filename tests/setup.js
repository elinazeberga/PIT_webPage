const mongoose = require('mongoose');

beforeAll(async () => {
    mongoose.set('strictQuery', true); // Set the strictQuery option

    await mongoose.connect(process.env.TEST_DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
