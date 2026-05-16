import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;

    if (
        authHeader &&
        authHeader.startsWith('Bearer ')
    ) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        res.status(401);

        throw new Error(
            'Access denied. No token provided'
        );
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing');
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
        .select('-password');

    if (!user) {
        res.status(401);

        throw new Error('User not found');
    }

    req.user = user;

    next();
});

export default protect;