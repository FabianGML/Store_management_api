const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const ProductService = require('./../services/product.service');
const { createProductSchema, getProductSchema,  updateProductSchema, getProductProvSchema, createProductProvSchema, updateProductProvSchema } = require('./../schemas/product.schema');

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

/* Product-Provider Router */

.get('/:providerId/auto-add',
    validatorHandler(getProductProvSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const autoAdd = await service.autoAddProdProv(providerId);
            res.json(autoAdd);
        } catch (error) {
            next(error)
        }
    }
)

.get('/:providerId/prod-prov',
    validatorHandler(getProductProvSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const allProducts = await service.getAllProductsProv(providerId);
            res.json(allProducts);
        } catch (error) {
            next(error)
        }
    }
)

.post('/:providerId/prod-prov', 
    validatorHandler(getProductProvSchema, 'params'),
    validatorHandler(createProductProvSchema, 'body'),
    async(req,res,next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const newProduct = await service.addProdProv(providerId, data);
            res.json(newProduct);
        } catch (error) {
            next(error)
        }
    }
)

.patch('/:providerId/prod-prov/:prodProvId', 
    validatorHandler(getProductProvSchema, 'params'),
    validatorHandler(updateProductProvSchema, 'body'),
    async(req,res,next) => {
        try {
            const { providerId, prodProvId } = req.params;
            const data = req.body;
            const product = await service.updateProdProv(providerId, prodProvId, data);
            res.json(product);
        } catch (error) {
            next(error)
        }
    }
)

.delete('/:providerId/prod-prov/:prodProvId', 
    validatorHandler(getProductProvSchema, 'params'),
    async(req,res,next) => {
        try {
            const { providerId, prodProvId } = req.params;
            const product = await service.deleteProdProv(providerId, prodProvId);
            res.json(product);
        } catch (error) {
            next(error)
        }
    }
)
module.exports = router