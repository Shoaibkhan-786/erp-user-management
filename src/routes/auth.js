import express from 'express';
import { validate } from 'express-validation';

import { loginSchema } from '../validations/auth.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;
