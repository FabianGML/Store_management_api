const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const UserService = require('./../services/user.service');
const { createUserSchema, updateNameUserSchema, changePrivateSchema, getUserSchema } = require('./../schemas/user.schema');


const router = express.Router();
const service = new UserService();

router.get('/', 
    async (req, res, next) => {
    try {
        const users = await service.find();
        res.json(users);
    } catch (error) {
        next(error)
    }   
    }
);

router.get('/:id', 
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params; 
            const user = await service.findOne(id)
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/', 
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newUser = await service.create(body);
            res.status(201).json(newUser)
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/name/:id',
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateNameUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const user = await service.updateName(id, body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/private/:id',
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(changePrivateSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = req.body;
            const rta = await service.updatePrivate(id, changes);
            res.json(rta)
        } catch (error) {
            next(error);
        }
    }
);

/*
This operation should only be able for the super-admin role, 
and should ask for password or somenthing
*/
router.delete('/:id',
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const rta = await service.delete(id);
            res.json(rta)
        } catch (error) {
            next(error)
        }
    }
);


module.exports = router;