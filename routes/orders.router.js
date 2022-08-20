const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const OrderService = require('./../services/order.service');
const { getOrderSchema, getOrderProductSchema, createOrderSchema, updateOrderSchema, addItemSchema, updateItemSchema  } = require('./../schemas/order.schema');


const router = express.Router();
const service = new OrderService();

router.get('/', 
    async (req, res, next) => {
        try {
            const orders = await service.getOrders()
            res.json(orders)
        } catch (error) {
            next(error)
        }
    }
)

.get('/:id', 
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

.post('/',
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

.patch('/:id', 
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

.patch('/:id/:itemId', 
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

.delete('/:id/:itemId', 
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