const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const ProductService = require('./../services/product.service');
const { createProductSchema, getProductSchema,  updateProductSchema } = require('./../schemas/product.schema');
const { checkRoles } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new ProductService();

/* Get all the products and the laboratory it belongs to  */
router.get('/',
    checkRoles('seller'),
    async (req, res, next ) => {
        try {
            const products = await service.getAllProducts()
            res.json(products);
        } catch (error) {
            next(error)
        }
    }
)

/* Get one product and all its info */
.get('/:id', 
    checkRoles('seller'),
    validatorHandler(getProductSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await service.getOneProduct(id);    
            res.json(product);
        } catch (error) {
            next(error)
        }
        

    }
)

/* Create a new product can be a single product or a bulk of it 
-name (required)
-price (required)
-stock (required)
-line (required)
-ingredients (required)
-labId (required)
-description
-expiration
-expiration2
-userId (required)

*/
.post('/', 
    checkRoles(),
    validatorHandler(createProductSchema, 'body'),  
    async (req, res, next) => {
        try {
            const body = req.body;
            const newProduct = await service.create(body);
            res.status(201).json(newProduct)
        } catch (error) {
            next(error)
        }
    }
)

/* Update one product  
-name
-price
-stock
-line
-ingredients
-labId
-description
-expiration
-expiration2
*/
.patch('/:id', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getProductSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            await service.update(id, body);
            res.json({
                message: `Producto ${changes.name} actualizado correctamente`,
            })
        } catch (error) {
            next(error)
        }
    }
)

/*  Delete one product */
.delete('/:id', 
    passport.authenticate('local', {session: false}),
    checkRoles(),
    validatorHandler(getProductSchema, 'params'),
    async(req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            res.json({
                message: 'Producto eliminado correctamente'
            })
        } catch (error) {
            next(error)
        }
    }
)


module.exports = router