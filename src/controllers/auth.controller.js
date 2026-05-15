import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import users from '../data/users.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { name, email, password, role } = req.body;

        const existingUser = users.find((user) => user.email === email);

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            role,
        };

        users.push(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        const user = users.find((user) => user.email === email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
        });
    }
};