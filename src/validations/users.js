import Joi from "joi";

export const createUserSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        roleId: Joi.number().integer().required()
    })
};

export const getAllUsersSchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(1).max(100).default(10)
    })
};

export const deleteUserSchema = {
    params: Joi.object({
        id: Joi.number().integer().required()
    })
};