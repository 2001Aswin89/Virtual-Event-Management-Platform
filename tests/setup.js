import mongoose from 'mongoose';
import dotenv from 'dotenv';

import connectDB from '../src/config/db.js';

dotenv.config({
    path: '.env.test',
    quiet: true,
});

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    const collections =
        mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});