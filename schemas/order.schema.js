const Joi = require('joi').extend(require('@joi/date'));

const id = Joi.number().positive().required();
const total = Joi.number().positive().required();
const providerId = Joi.number().positive();
const orderArrive = Joi.date();
const isPayed = Joi.boolean();

// const orderId = Joi.number().positive();
const name = Joi.string();
const unitPrice = Joi.number().positive();
const amount = Joi.number().positive();
const expiration = Joi.date();
const items = Joi.array().items(Joi.object({
    name: name.required(),
    unitPrice,
    amount,
    expiration: expiration.required()
}))
 


const getOrderSchema = Joi.object({
    id
});

const createOrderSchema = Joi.object({
    providerId: providerId.required(),
    isPayed,
    orderArrive,
    items
});

const updateOrderSchema = Joi.object({
    total,
    providerId,
    isPayed,
    orderArrive
});

const updateItemSchema = Joi.object({
    name,
    unitPrice,
    amount
})

module.exports = { getOrderSchema, createOrderSchema, updateOrderSchema, updateItemSchema }