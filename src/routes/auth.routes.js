import express from 'express';

import {
    loginUser,
    registerUser,
} from '../controllers/auth.controller.js';

import {
    loginValidator,
    registerValidator,
} from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidator, registerUser);

router.post('/login', loginValidator, loginUser);

export default router;