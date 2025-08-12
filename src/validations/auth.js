import Joi from 'joi';

export const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required().trim().lowercase().label('Email ID'),
        password: Joi.string().required().max(32).trim().label('Password'),
    }),
};
