const Joi = require('joi');

const id = Joi.number().positive().required();
const name = Joi.string();
const email = Joi.string().email();
const phone = Joi.string().min(8);
const phone2 = Joi.string().min(8);

const getProviderSchema = Joi.object({
    id
});

const createProviderSchema = Joi.object({
    name: name.required(),
    email,
    phone,
    phone2
});

const updateProviderSchema = Joi.object({
    name,
    email,
    phone,
    phone2
});

module.exports = { getProviderSchema, createProviderSchema, updateProviderSchema }
