import express from 'express';
import { validate } from 'express-validation';

import { createUserSchema, getAllUsersSchema, deleteUserSchema } from '../validations/users.js';
import { createUser, getUsers, deleteUser, getUser } from '../controllers/userController.js';
import { authenticate, ensureRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, ensureRole('CA'), validate(createUserSchema), createUser);
router.get('/', authenticate, validate(getAllUsersSchema, { context: true }), getUsers);
router.get('/getUser', authenticate, getUser);
router.delete('/:id', authenticate, ensureRole('CA'), validate(deleteUserSchema), deleteUser);

export default router;
