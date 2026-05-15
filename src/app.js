import dotenv from 'dotenv';
import express from 'express';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Virtual Event Management API Running',
    });
});

app.use('/api/auth', authRoutes);

export default app;