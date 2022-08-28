const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const ProviderService = require('./../services/provider.service');
const { getProviderSchema, getLabProviderSchema,  createProviderSchema, updateProviderSchema, labsSchema, getProductProvSchema, createProductProvSchema, updateProductProvSchema  } = require('./../schemas/provider.schema');



const router = express.Router();
const service = new ProviderService();

router.get('/', 
    async (req, res, next) => {
        try {
            const providers = await service.getProviders();
            res.json(providers);    
        } catch (error) {
            next(error)
        }
        
    }
)

.get('/:providerId', 
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const provider = await service.getOneProvider(providerId);
            res.json(provider);
        } catch (error) {
            next(error)
        }
    }
)

.post('/', 
    validatorHandler(createProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newProvider = await service.createProvider(body);
            res.json(newProvider);
        } catch (error) {
            next(error)
        }
    }
)

.patch('/:providerId', 
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(updateProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const changes = await service.update(providerId, data);
            res.json(changes);
        } catch (error) {
            next(error);
        }
    }
)

.delete('/:providerId', 
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const deletedProvider = await service.delete(providerId);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)

/* Labs Provider router */
.post('/:providerId',
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(labsSchema, 'body'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const addLab = await service.addLab(data, providerId)
            res.status(201).json(addLab)
        } catch (error) {
            next(error)
        }
    }
)

.patch('/:providerId/:labProviderId', 
    validatorHandler(getLabProviderSchema, 'params'),
    validatorHandler(labsSchema, 'body'),
    async (req, res, next) => {
        try {
            const { providerId, labProviderId } = req.params;
            const data = req.body;
            const deletedProvider = await service.updateLab(providerId, labProviderId, data);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)

.delete('/:providerId/:labProviderId', 
    validatorHandler(getLabProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId, labProviderId } = req.params;
            const deletedProvider = await service.deleteLab(providerId, labProviderId);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
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