import express from 'express';
import authRoute from './auth.js';
import userRoute from './users.js';
import rolesRoute from './roles.js';

const indexRouter = express.Router();

indexRouter.use('/auth', authRoute);
indexRouter.use('/users', userRoute);
indexRouter.use('/roles', rolesRoute);

export default indexRouter;