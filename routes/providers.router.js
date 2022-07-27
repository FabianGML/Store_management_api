const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const ProviderService = require('./../services/provider.service');
const { getProviderSchema, createProviderSchema, updateProviderSchema } = require('./../schemas/provider.schema');



const router = express.Router();
const service = new ProviderService();

router.get('/', 
    async (req, res, next) => {
        try {
            const providers = await service.find();
            res.json(providers);    
        } catch (error) {
            next(error)
        }
        
    }
);

router.get('/:id', 
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const provider = await service.findOne(id);
            res.json(provider);
        } catch (error) {
            next(error)
        }
    }
);

router.post('/', 
    validatorHandler(createProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newProvider = await service.create(body);
            res.json(newProvider);
        } catch (error) {
            next(error)
        }
    }
);

router.patch('/:id', 
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
);

router.delete('/:id', 
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
);

module.exports = router