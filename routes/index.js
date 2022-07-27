const express = require('express');

const userRouter = require('./users.router');
const labRouter = require('./labs.router');
const providerRouter = require('./providers.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api', router);
    router.use('/users', userRouter);
    router.use('/labs', labRouter);
    router.use('/providers', providerRouter);
}

module.exports = routerApi;