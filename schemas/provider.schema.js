const Joi = require('joi');

const providerId = Joi.number().positive().required();
const labProviderId = Joi.number().positive().required();
const name = Joi.string();
const email = Joi.string().email();
const phone = Joi.string().min(8);
const phone2 = Joi.string().min(8);

const labName = Joi.string().required();
const labs = Joi.array().items(Joi.object({
    labName
}))

/* product-provider Schema */
const productId = Joi.number().positive().required();
const prodProvId = Joi.number().positive();
const productsProv = Joi.array().items(Joi.object({
    productId
}))

const getProviderSchema = Joi.object({
    providerId
});

const getLabProviderSchema = Joi.object({
    providerId,
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

/* product-providder */

const getProductProvSchema = Joi.object({
    providerId,
    prodProvId
})

const createProductProvSchema = Joi.object({
    productsProv
})

const updateProductProvSchema = Joi.object({
    productId
})

module.exports = { getProviderSchema, getLabProviderSchema, createProviderSchema, updateProviderSchema, labsSchema, getProductProvSchema, createProductProvSchema, updateProductProvSchema }
