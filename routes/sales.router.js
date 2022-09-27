const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const SaleService = require('./../services/sale.service');
const { getSaleSchema, createSaleSchema } = require('./../schemas/sale.schema');
const { checkRoles } = require('../middlewares/auth.handler');


const router = express.Router();
const service = new SaleService();


/* Get all sales, with date and total from each sale */
router.get('/', 
    checkRoles(),
    async (req, res, next) => {
    try {
        const sales = await service.getAllSales()
        res.json(sales);
    } catch (error) {
        next(error)
    }   
    }
)

/* Get one sale with all the product in it */
.get('/:saleId', 
    checkRoles(),
    validatorHandler(getSaleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { saleId } = req.params; 
            const sale = await service.getOneSale(saleId)
            res.json(sale);
        } catch (error) {
            next(error);
        }
    }
)

/* Create a new sale  */
.post('/', 
    checkRoles('seller'),
    validatorHandler(createSaleSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const user = req.user 
            const newSale = await service.createSale(body, user.sub);
            res.status(201).json(newSale)
        } catch (error) {
            next(error);
        }
    }
)


module.exports = router;