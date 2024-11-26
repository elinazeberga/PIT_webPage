const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

beforeAll(async () => {
    mongoose.set('strictQuery', true);
    const testDbUri = process.env.TEST_DB_NAME;
    console.log('Connecting to Test DB:', testDbUri);
    await mongoose.connect(testDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Can drop the db to cleanup tests
// Better to run tests indivitually at the moment
afterAll(async () => {
    console.log('Dropping database');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

// Can cleanup the collections to cleanup tests
// afterEach(async () => {
// afterAll(async () => {
//     console.log('Deleteing collections');
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//         const collection = collections[key];
//         await collection.deleteMany();
//     }
// });
