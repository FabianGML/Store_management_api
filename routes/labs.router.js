const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const LabService = require('./../services/lab.service');
const { getLabSchema, labSchema } = require('./../schemas/lab.schema');


const router = express.Router();
const service = new LabService();

router.get('/', 
    async (req, res, next) => {
        try {
            const labs = await service.find()
            res.json(labs)
        } catch (error) {
            next(error)
        }
    }
);

router.get('/:id', 
    validatorHandler(getLabSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const lab = await service.findOne(id);
            res.json(lab)
        } catch (error) {
            next(error)
        }
    }
)

router.post('/',
    validatorHandler(labSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newLab = await service.create(body);
            res.json(newLab);    
        } catch (error) {
            next(error)
        }
        
    }
);

router.patch('/:id', 
    validatorHandler(getLabSchema, 'params'),
    validatorHandler(labSchema, 'body'),
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
    validatorHandler(getLabSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedLab = await service.delete(id);
            res.json(deletedLab);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router