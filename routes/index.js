const express = require('express');

const userRouter = require('./users.router');
const labRouter = require('./labs.router');
const providerRouter = require('./providers.router');
const orderRouter = require('./orders.router');
const productRouter = require('./products.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', userRouter);
    router.use('/labs', labRouter);
    router.use('/providers', providerRouter);
    router.use('/orders', orderRouter);
    router.use('/products', productRouter);
}

module.exports = routerApi;