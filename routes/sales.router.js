const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const SaleService = require('./../services/sale.service');
const { getSaleSchema, createSaleSchema } = require('./../schemas/sale.schema');


const router = express.Router();
const service = new SaleService();

router.get('/', 
    async (req, res, next) => {
    try {
        const sales = await service.getAllSales()
        res.json(sales);
    } catch (error) {
        next(error)
    }   
    }
)

.get('/:saleId', 
    validatorHandler(getSaleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { saleId } = req.params; 
            const user = await service.getOneSale(saleId)
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
)

.post('/', 
    validatorHandler(createSaleSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newUser = await service.createSale(body);
            res.status(201).json(newUser)
        } catch (error) {
            next(error);
        }
    }
)


module.exports = router;