const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const ProviderService = require('./../services/provider.service');
const { getProviderSchema, getLabProviderSchema,  createProviderSchema, updateProviderSchema, labsSchema } = require('./../schemas/provider.schema');



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

.get('/:id', 
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const provider = await service.getOneProvider(id);
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

.patch('/:id', 
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(updateProviderSchema, 'body'),
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

.delete('/:id', 
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedProvider = await service.delete(id);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)

/* Labs Provider router */
.post('/:id',
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(labsSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const addLab = await service.addLab(data, id)
            res.status(201).json(addLab)
        } catch (error) {
            next(error)
        }
    }
)

.patch('/:id/:labProviderId', 
    validatorHandler(getLabProviderSchema, 'params'),
    validatorHandler(labsSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id, labProviderId } = req.params;
            const data = req.body;
            const deletedProvider = await service.updateLab(id, labProviderId, data);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)

.delete('/:id/:labProviderId', 
    validatorHandler(getLabProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id, labProviderId } = req.params;
            const deletedProvider = await service.deleteLab(id, labProviderId);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)


module.exports = router