const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const UserService = require('../services/user.service');
const {getUserSchema, updateFullNameUserSchema, changePrivateSchema} = require('./../schemas/user.schema')

const router = express.Router();
const service = new UserService();

/* End point to get the current user info and sales */
router.get('/', 
    async (req, res, next) => {
        try {
            const user = req.user
            const profile = await service.getOneProfile(user.sub)
            res.json(profile)
        } catch (error) {
            next(error)
        }
    }
)

/* Current user can change their password and email */
.patch('/private',
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
)
module.exports = router