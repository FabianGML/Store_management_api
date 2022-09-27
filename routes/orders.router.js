const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const OrderService = require('./../services/order.service');
const { getOrderSchema, getOrderProductSchema, createOrderSchema, updateOrderSchema, addItemSchema, updateItemSchema  } = require('./../schemas/order.schema');
const { checkRoles } = require('./../middlewares/auth.handler')


const router = express.Router();
const service = new OrderService();

/* Get all orders and who belongs it  */
router.get('/', 
    checkRoles(),
    async (req, res, next) => {
        try {
            const orders = await service.getOrders()
            res.json(orders)
        } catch (error) {
            next(error)
        }
    }
)

/* Get a single order and each product in the order */
.get('/:id', 
    checkRoles(),
    validatorHandler(getOrderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const order = await service.getOneOrder(id);
            res.json(order)
        } catch (error) {
            next(error)
        }
    }
)

/* Create a new order 
user can send an array to create an order with multiple entries each entry need the following schema

name (required)
unitPrice
amount (required)
expiration

 */
.post('/',
    checkRoles('seller'),
    validatorHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newOrder = await service.createOrder(body);            
            res.status(201).json(newOrder);    
        } catch (error) {
            next(error)
        }
        
    }
)

/* Change an order  */
.patch('/:id', 
    checkRoles(),
    validatorHandler(getOrderSchema, 'params'),
    validatorHandler(updateOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const changes = await service.updateOrder(id, data);
            res.json(changes);
        } catch (error) {
            next(error);
        }
    }
)

/* Change some values from a single item from an order */
.patch('/:id/:itemId', 
    checkRoles(),
    validatorHandler(getOrderProductSchema, 'params'),
    validatorHandler(updateItemSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id, itemId } = req.params;
            const data = req.body;
            const changes = await service.updateItem(id, itemId, data)
            res.json(changes);
        } catch (error) {
            next(error)
        }
    }
)

/* Delete a single item from an order need email and password admin validation*/
.delete('/:id/:itemId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getOrderProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id, itemId } = req.params;
            const deletedOrder = await service.deleteItem(id, itemId);
            res.json(deletedOrder);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router