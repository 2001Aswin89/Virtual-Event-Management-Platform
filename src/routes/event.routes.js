import express from 'express';

import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    registerForEvent,
    cancelEventRegistration,
} from '../controllers/event.controller.js';

import protect from '../middleware/auth.middleware.js';
import authorizeRoles from '../middleware/role.middleware.js';

import {
    createEventValidator,
} from '../validators/event.validator.js';

const router = express.Router();

router.get('/', getAllEvents);

router.get('/:id', getSingleEvent);

router.post(
    '/:id/register',
    protect,
    authorizeRoles('attendee'),
    registerForEvent
);

router.delete(
    '/:id/register',
    protect,
    authorizeRoles('attendee'),
    cancelEventRegistration
);

router.post(
    '/',
    protect,
    authorizeRoles('organizer'),
    createEventValidator,
    createEvent
);

router.put(
    '/:id',
    protect,
    authorizeRoles('organizer'),
    updateEvent
);

router.delete(
    '/:id',
    protect,
    authorizeRoles('organizer'),
    deleteEvent
);

export default router;