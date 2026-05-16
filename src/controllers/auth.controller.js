import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

export const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400);

        throw new Error(errors.array()[0].msg);
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(409);

        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400);

        throw new Error(errors.array()[0].msg);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);

        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        res.status(401);

        throw new Error('Invalid credentials');
    }

    const token = generateToken({
        id: user._id,
        role: user.role,
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});