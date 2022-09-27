const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const UserService = require('./../services/user.service');
const { createUserSchema, getUserSchema, updateFullNameUserSchema} = require('./../schemas/user.schema');
const { checkRoles } = require('./../middlewares/auth.handler');


const router = express.Router();
const service = new UserService();

router.use(checkRoles());

/* 
    These end points are only allowed for admins users 
*/

/* Get all users */
router.get('/', 
    async (req, res, next) => {
    try {
        const users = await service.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error)
    }   
    }
)

/* Get a single user info and their sales */
.get('/:id', 
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params; 
            const user = await service.getOneProfile(id)
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
)

/* 
    Create a new user
    -name
    -lastName
    -role
    -email
    -repeatEmail
    -password
    -repeatPassword
 */
.post('/', 
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
)

/* End point so that an admin can change the first and last name of the seller
    -name
    -lastName
*/
.patch('/:id',
    passport.authenticate('local', {session: false}),
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateFullNameUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const update = await service.updateFullName(id, body);
            res.json(update);
        } catch (error) {
            next(error);
        }
    }
)

/* Delete one user  */
.delete('/:id',
    passport.authenticate('local', {session: false}),
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
)


module.exports = router;