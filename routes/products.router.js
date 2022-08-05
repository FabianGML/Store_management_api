const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const ProductService = require('./../services/product.service');
const { getProductSchema, createProductSchema, updateProductSchema } = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductService();

router.get('/',
    async (req, res, next ) => {
        try {
            const products = await service.getAllProducts()
            res.json(products);
        } catch (error) {
            next(error)
        }
    }
)

.get('/:id', 
    validatorHandler(getProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await service.getOneProduct(id);    
            res.json(product);
        } catch (error) {
            next(error)
        }
        

    }
)

.post('/', 
    validatorHandler(createProductSchema, 'body'),  
    async (req, res, next) => {
        try {
            const body = req.body;
            const newProduct = await service.create(body);
            res.status(201).json(newProduct)
        } catch (error) {
            next(error)
        }
    }
)

.patch('/:id', 
    validatorHandler(getProductSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            await service.update(id, body);
            res.json({
                message: `Producto ${changes.name} actualizado correctamente`,
            })
        } catch (error) {
            next(error)
        }
    }
)

.delete('/:id', 
    validatorHandler(getProductSchema, 'params'),
    async(req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            res.json({
                message: 'Producto eliminado correctamente'
            })
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router