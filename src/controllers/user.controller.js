import Event from '../models/Event.js';

import asyncHandler from '../utils/asyncHandler.js';

export const getMyRegisteredEvents =
    asyncHandler(async (req, res) => {
        const events = await Event.find({
            attendees: req.user._id,
        })
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events,
        });
    });