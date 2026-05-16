import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';

import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import eventRoutes from './routes/event.routes.js';
import userRoutes from './routes/user.routes.js';

import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js';

const app = express();
// Security headers
app.use(helmet());

// Enable CORS
app.use(
    cors({
        origin: '*',
    })
);

// Compress responses
app.use(compression());

// Request logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 500,

    message: {
        success: false,
        message:
            'Too many requests, please try again later',
    },
});

app.use(limiter);

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Virtual Event Management API Running',
    });
});

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;