const Joi = require('joi');

const id = Joi.number().positive().required();
const labProviderId = Joi.number().positive().required();
const name = Joi.string();
const email = Joi.string().email();
const phone = Joi.string().min(8);
const phone2 = Joi.string().min(8);

const labName = Joi.string().required();
const labs = Joi.array().items(Joi.object({
    labName
}))

const getProviderSchema = Joi.object({
    id
});

const getLabProviderSchema = Joi.object({
    id,
    labProviderId
})


const createProviderSchema = Joi.object({
    name: name.required(),
    email,
    phone,
    phone2,
    labs
});

const updateProviderSchema = Joi.object({
    name,
    email,
    phone,
    phone2
});

const labsSchema = Joi.object({
    labs
})

module.exports = { getProviderSchema, getLabProviderSchema, createProviderSchema, updateProviderSchema, labsSchema }
