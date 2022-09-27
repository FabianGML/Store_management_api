const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const LabService = require('./../services/lab.service');
const { getLabSchema, labSchema } = require('./../schemas/lab.schema');
const { checkRoles } = require('./../middlewares/auth.handler');


const router = express.Router();
const service = new LabService();

/* Get all labs */
router.get('/', 
    checkRoles('seller'),
    async (req, res, next) => {
        try {
            const labs = await service.find()
            res.json(labs)
        } catch (error) {
            next(error)
        }
    }
)

/* Get a single lab and every product that belongs to that lab  */
.get('/:id', 
    checkRoles('seller'),
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

/* Create a new laboratory */
.post('/',
    checkRoles(),
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
)

/* Change the lab name */
.patch('/:id', 
    checkRoles(),
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
)

/* Remove a lab */
.delete('/:id', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
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
)

module.exports = router