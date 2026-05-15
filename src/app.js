import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import authRoutes from './routes/auth.routes.js';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Virtual Event Management API Running',
    });
});

app.use('/api/auth', authRoutes);

export default app;