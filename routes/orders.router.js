const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const OrderService = require('./../services/order.service');
const { getOrderSchema, createOrderSchema, updateOrderSchema, addItemSchema, updateItemSchema  } = require('./../schemas/order.schema');


const router = express.Router();
const service = new OrderService();

router.get('/', 
    async (req, res, next) => {
        try {
            const orders = await service.find()
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
            const changes = await service.update(id, data);
            res.json(changes);
        } catch (error) {
            next(error);
        }
    }
)
.patch('/item/:id', 
    validatorHandler(getOrderSchema, 'params'),
    validatorHandler(updateItemSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const changes = service.updateItem(id, body);
            res.json(changes);
            
        } catch (error) {
            next(error)
        }
    }
)
.delete('/:id', 
    validatorHandler(getOrderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedOrder = await service.delete(id);
            res.json(deletedOrder);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router