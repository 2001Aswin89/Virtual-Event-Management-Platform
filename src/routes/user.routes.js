import express from 'express';

import protect from '../middleware/auth.middleware.js';

import {
    getMyRegisteredEvents,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get(
    '/me/events',
    protect,
    getMyRegisteredEvents
);

export default router;