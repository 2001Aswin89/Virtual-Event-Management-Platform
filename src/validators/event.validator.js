import { body } from 'express-validator';

export const createEventValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required'),

    body('description')
        .notEmpty()
        .withMessage('Description is required'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format'),

    body('time')
        .notEmpty()
        .withMessage('Time is required'),

    body('location')
        .notEmpty()
        .withMessage('Location is required'),
];