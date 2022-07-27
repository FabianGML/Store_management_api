const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

function showErrors(err, req, res, next) {
    console.log(err);
    next(err)
}

function errorHandler(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    })
}

function boomError(err, req, res, next) {
    if(err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err)
}

function seqErrorHandler(err, req, res, next) {
    if(err instanceof ValidationError) {
        res.status(409).json({
            statusCode: 409,
            message: err.name,
            errors: err.errors,
        });
    }
    next(err)
}

//No funciona el manejo de errores cuando la llave se repite
function sequelizeUnique(err, req, res, next) {
    if (err.name === 'SequelizeUniqueConstraintError'){
        res.status(403).json({
            statusCode,
            message: 'El usuario ya Existe'
        })
    }
    next(err)
}


module.exports = { showErrors, errorHandler, boomError, seqErrorHandler, sequelizeUnique };