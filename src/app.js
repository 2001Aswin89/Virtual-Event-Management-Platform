import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import eventRoutes from './routes/event.routes.js';

import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Virtual Event Management API Running',
    });
});

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;