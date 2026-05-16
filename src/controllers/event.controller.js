import { validationResult } from 'express-validator';

import Event from '../models/Event.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createEvent = asyncHandler(
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400);

            throw new Error(errors.array()[0].msg);
        }

        const {
            title,
            description,
            date,
            time,
            location,
        } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            organizer: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event,
        });
    }
);

export const getAllEvents = asyncHandler(
    async (req, res) => {
        const {
            search,
            location,
            upcoming,
            sort,
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        // Search by title
        if (search) {
            query.title = {
                $regex: search,
                $options: 'i',
            };
        }

        // Filter by location
        if (location) {
            query.location = {
                $regex: location,
                $options: 'i',
            };
        }

        // Upcoming events only
        if (upcoming === 'true') {
            query.date = {
                $gte: new Date(),
            };
        }

        if (upcoming === 'false') {
            query.date = {
                $lt: new Date(),
            };
        }

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip =
            (pageNumber - 1) * limitNumber;

        // Sorting
        let sortOption = {};

        if (sort === 'date') {
            sortOption.date = 1;
        } else if (sort === 'created') {
            sortOption.createdAt = -1;
        } else {
            sortOption.createdAt = -1;
        }

        const totalEvents = await Event.countDocuments(
            query
        );

        const events = await Event.find(query)
            .populate(
                'organizer',
                'name email role'
            )
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,

            pagination: {
                total: totalEvents,
                page: pageNumber,
                pages: Math.ceil(
                    totalEvents / limitNumber
                ),
                limit: limitNumber,
            },

            count: events.length,

            events,
        });
    }
);

export const getSingleEvent = asyncHandler(
    async (req, res) => {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email role')
            .populate('attendees', 'name email');

        if (!event) {
            res.status(404);

            throw new Error('Event not found');
        }

        res.status(200).json({
            success: true,
            event,
        });
    }
);

export const updateEvent = asyncHandler(
    async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);

            throw new Error('Event not found');
        }

        if (
            event.organizer.toString() !==
            req.user._id.toString()
        ) {
            res.status(403);

            throw new Error(
                'You can only update your own events'
            );
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    }
);

export const deleteEvent = asyncHandler(
    async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);

            throw new Error('Event not found');
        }

        if (
            event.organizer.toString() !==
            req.user._id.toString()
        ) {
            res.status(403);

            throw new Error(
                'You can only delete your own events'
            );
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    }
);

export const registerForEvent = asyncHandler(
    async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);

            throw new Error('Event not found');
        }

        const alreadyRegistered = event.attendees.includes(
            req.user._id
        );

        if (alreadyRegistered) {
            res.status(409);

            throw new Error(
                'User already registered for this event'
            );
        }

        if (
            event.organizer.toString() ===
            req.user._id.toString()
        ) {
            res.status(400);

            throw new Error(
                'Organizer cannot register as attendee'
            );
        }

        event.attendees.push(req.user._id);

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered for event',
        });
    }
);

export const cancelEventRegistration =
    asyncHandler(async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);

            throw new Error('Event not found');
        }

        const isRegistered = event.attendees.includes(
            req.user._id
        );

        if (!isRegistered) {
            res.status(400);

            throw new Error(
                'User is not registered for this event'
            );
        }

        event.attendees = event.attendees.filter(
            (attendeeId) =>
                attendeeId.toString() !==
                req.user._id.toString()
        );

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event registration cancelled',
        });
    });