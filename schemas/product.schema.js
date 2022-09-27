const Joi = require('joi').extend(require('@joi/date'));

const id = Joi.number().positive().required();
const name = Joi.string();
const price = Joi.number().positive();
const stock = Joi.number().positive();
const line = Joi.string().valid('Homeopatica', 'Naturista');
const ingredients = Joi.string();
const labId = Joi.number().positive();
const description = Joi.string();
const expiration = Joi.date().format('DD-MM-YYYY').utc();
const expiration2 = Joi.date().format('DD-MM-YYYY').utc();
const userId = Joi.number().positive();

const products = Joi.array().items(Joi.object({
    name: name.required(),
    price: price.required(),
    stock: stock.required(),
    line: line.required(),
    ingredients: ingredients.required(),
    labId: labId.required(),
    description,
    expiration,
    expiration2,
    userId: userId.required(),
}))



const createProductSchema = Joi.object({
    products
});

const getProductSchema = Joi.object({
    id
});


const updateProductSchema = Joi.object({
    name,
    price,
    stock,
    line,
    ingredients,
    labId,
    description,
    expiration,
    expiration2,
});

module.exports = { createProductSchema, getProductSchema, updateProductSchema }
