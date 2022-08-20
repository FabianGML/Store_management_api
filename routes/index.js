const express = require('express');

const userRouter = require('./users.router');
const labRouter = require('./labs.router');
const providerRouter = require('./providers.router');
const orderRouter = require('./orders.router');
const productRouter = require('./products.router');
const saleRouter = require('./sales.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', userRouter)
    .use('/labs', labRouter)
    .use('/providers', providerRouter)
    .use('/orders', orderRouter)
    .use('/products', productRouter)
    .use('/sales', saleRouter)
}

module.exports = routerApi;