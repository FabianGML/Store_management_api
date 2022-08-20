const Joi = require('joi').extend(require('@joi/date'));

const id = Joi.number().positive().required();
const itemId = Joi.number().positive().required();
const providerId = Joi.number().positive();
const orderArrive = Joi.date();
const isPayed = Joi.boolean();

const orderId = Joi.number().positive();
const name = Joi.string();
const unitPrice = Joi.number().positive();
const amount = Joi.number().positive();
const expiration = Joi.date();
const items = Joi.array().items(Joi.object({
    name: name.required(),
    unitPrice,
    amount: amount.required(),
    expiration
}))
 


const getOrderSchema = Joi.object({
    id
});

const getOrderProductSchema = Joi.object({
    id,
    itemId
})

const createOrderSchema = Joi.object({
    providerId: providerId.required(),
    isPayed,
    orderArrive,
    items
});

const updateOrderSchema = Joi.object({
    providerId,
    isPayed,
    orderArrive
});

const updateItemSchema = Joi.object({
    items
})

const addItemSchema = Joi.object({
    orderId,
    items

})

module.exports = { getOrderSchema, getOrderProductSchema, createOrderSchema, updateOrderSchema, updateItemSchema, addItemSchema }