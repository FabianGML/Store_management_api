const express = require('express');
const passport = require('passport');

const validatorHandler = require('./../middlewares/validator.handler');
const ProviderService = require('./../services/provider.service');
const { getProviderSchema, getLabProviderSchema,  createProviderSchema, updateProviderSchema, labsSchema, getProductProvSchema, createProductProvSchema, updateProductProvSchema  } = require('./../schemas/provider.schema');
const { checkRoles } = require('./../middlewares/auth.handler');
const { check } = require('prettier');


const router = express.Router();
const service = new ProviderService();

/* Get All the providers in DataBase */
router.get('/', 
    checkRoles('seller'),
    async (req, res, next) => {
        try {
            const providers = await service.getProviders();
            res.json(providers);    
        } catch (error) {
            next(error)
        }
        
    }
)

/* Get One provider by it's id */
.get('/:providerId', 
    checkRoles('seller'),
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const provider = await service.getOneProvider(providerId);
            res.json(provider);
        } catch (error) {
            next(error)
        }
    }
)

/* Create a new provider in DB the end point need:
    -name (required)
    -email
    -phone
    -phone2
    -labs (an array of objects with each laboratory we want to add)

*/
.post('/', 
    checkRoles(),
    validatorHandler(createProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newProvider = await service.createProvider(body);
            res.json(newProvider);
        } catch (error) {
            next(error)
        }
    }
)

/* Update provider's info 
    -name
    -email
    -phone
    -phone2
 */
.patch('/:providerId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(updateProviderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const changes = await service.update(providerId, data);
            res.json(changes);
        } catch (error) {
            next(error);
        }
    }
)

/* Delete the provider by it's id */
.delete('/:providerId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const deletedProvider = await service.delete(providerId);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)


/* Labs Provider relation router */

/* Associate a new laboratory to a provider 
    -name (lab name)
*/
.post('/:providerId',
    checkRoles(),
    validatorHandler(getProviderSchema, 'params'),
    validatorHandler(labsSchema, 'body'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const addLab = await service.addLab(data, providerId)
            res.status(201).json(addLab)
        } catch (error) {
            next(error)
        }
    }
)

/* Delete a laboratory associated to a provider */
.delete('/:providerId/:labProviderId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getLabProviderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId, labProviderId } = req.params;
            const deletedProvider = await service.deleteLab(providerId, labProviderId);
            res.json(deletedProvider);
        } catch (error) {
            next(error);
        }
    }
)

/* Product-Provider Router */

/* The end ponit automatically associate all the products with it's provider */
.get('/:providerId/auto-add',
    checkRoles(),
    validatorHandler(getProductProvSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const autoAdd = await service.autoAddProdProv(providerId);
            res.json(autoAdd);
        } catch (error) {
            next(error)
        }
    }
)

/* 
    Get all the info from products_provider table, each entry has a provider id 
    and a product id, the product associate with that product id is also include
  */
.get('/:providerId/prod-prov',
    validatorHandler(getProductProvSchema, 'params'),
    async (req, res, next) => {
        try {
            const { providerId } = req.params;
            const allProducts = await service.getAllProductsProv(providerId);
            res.json(allProducts);
        } catch (error) {
            next(error)
        }
    }
)

/* add manually products the provider have */
.post('/:providerId/prod-prov', 
    checkRoles(),
    validatorHandler(getProductProvSchema, 'params'),
    validatorHandler(createProductProvSchema, 'body'),
    async(req,res,next) => {
        try {
            const { providerId } = req.params;
            const data = req.body;
            const newProduct = await service.addProdProv(providerId, data);
            res.json(newProduct);
        } catch (error) {
            next(error)
        }
    }
)

/* Update an entry from products_provider */
.patch('/:providerId/prod-prov/:prodProvId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getProductProvSchema, 'params'),
    validatorHandler(updateProductProvSchema, 'body'),
    async(req,res,next) => {
        try {
            const { providerId, prodProvId } = req.params;
            const data = req.body;
            const product = await service.updateProdProv(providerId, prodProvId, data);
            res.json(product);
        } catch (error) {
            next(error)
        }
    }
)

/* Delete an entry from products_provider */
.delete('/prod-prov/:prodProvId', 
    checkRoles(),
    passport.authenticate('local', {session: false}),
    validatorHandler(getProductProvSchema, 'params'),
    async(req,res,next) => {
        try {
            const { prodProvId } = req.params;
            const product = await service.deleteProdProv(providerId, prodProvId);
            res.json(product);
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router