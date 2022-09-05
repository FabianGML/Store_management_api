const express = require('express');
const passport = require('passport');

const AuthService = require('./../services/auth.service');
const service = new AuthService();

const userRouter = require('./users.router');
const labRouter = require('./labs.router');
const providerRouter = require('./providers.router');
const orderRouter = require('./orders.router');
const productRouter = require('./products.router');
const saleRouter = require('./sales.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.post('/login', 
        passport.authenticate('local', {session: false}),
            async (req, res, next) => {
                try {
                    const user = req.user;
                    res.json(service.signToken(user))
                } catch (error) {
                    next(error)
                }
            }
    )
    .use(passport.authenticate('jwt', {session: false}))
    .use('/users', userRouter)
    .use('/labs', labRouter)
    .use('/providers', providerRouter)
    .use('/orders', orderRouter)
    .use('/products', productRouter)
    .use('/sales', saleRouter)
    
}

module.exports = routerApi;