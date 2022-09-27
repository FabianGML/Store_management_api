const express = require('express');
const passport = require('passport');

const authRouter = require('./auth.router')
const userRouter = require('./users.router');
const labRouter = require('./labs.router');
const providerRouter = require('./providers.router');
const orderRouter = require('./orders.router');
const productRouter = require('./products.router');
const saleRouter = require('./sales.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router)
    router.use('/', authRouter)
    .use(passport.authenticate('jwt', {session: false}))
    .use('/users', userRouter)
    .use('/labs', labRouter)
    .use('/providers', providerRouter)
    .use('/orders', orderRouter)
    .use('/products', productRouter)
    .use('/sales', saleRouter)
    .use('/profile', profileRouter)
    
}

module.exports = routerApi;