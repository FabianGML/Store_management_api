const Joi = require('joi');

/* Sales schema */
const saleId = Joi.number().positive().required();
const userId = Joi.number().positive().required();

const productId = Joi.number().positive().required();
const amount = Joi.number().positive();

const items = Joi.array().items(Joi.object({
    productId,
    amount: amount.required()
}));

const getSaleSchema = Joi.object({
    saleId
});


/* Sales-product schema */

const createSaleSchema = Joi.object({
    items
});

module.exports = { getSaleSchema, createSaleSchema }