const Joi = require('joi');

const id = Joi.number().positive().required();
const name = Joi.string().min(2).required();

const getLabSchema = Joi.object({
    id
})

const labSchema = Joi.object({
    name
})

module.exports = { getLabSchema, labSchema }