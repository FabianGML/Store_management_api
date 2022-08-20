const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const SaleService = require('./../services/sale.service');
// const { } = require('./../schemas/sale.schema');


const router = express.Router();
// const service = new SaleService();

// router.get('/', 
//     async (req, res, next) => {
//     try {
//         const sales = await service.getAllSales()
//         res.json(users);
//     } catch (error) {
//         next(error)
//     }   
//     }
// )

// .get('/:id', 
//     validatorHandler(getUserSchema, 'params'),
//     async (req, res, next) => {
//         try {
//             const { id } = req.params; 
//             const user = await service.findOne(id)
//             res.json(user);
//         } catch (error) {
//             next(error);
//         }
//     }
// )

// .post('/', 
//     validatorHandler(createUserSchema, 'body'),
//     async (req, res, next) => {
//         try {
//             const body = req.body;
//             const newUser = await service.create(body);
//             res.status(201).json(newUser)
//         } catch (error) {
//             next(error);
//         }
//     }
// )

// .patch('/name/:id',
//     validatorHandler(getUserSchema, 'params'),
//     validatorHandler(updateNameUserSchema, 'body'),
//     async (req, res, next) => {
//         try {
//             const { id } = req.params;
//             const body = req.body;
//             const user = await service.updateName(id, body);
//             res.json(user);
//         } catch (error) {
//             next(error);
//         }
//     }
// )

// .patch('/private/:id',
//     validatorHandler(getUserSchema, 'params'),
//     validatorHandler(changePrivateSchema, 'body'),
//     async (req, res, next) => {
//         try {
//             const { id } = req.params;
//             const changes = req.body;
//             const rta = await service.updatePrivate(id, changes);
//             res.json(rta)
//         } catch (error) {
//             next(error);
//         }
//     }
// )

// .delete('/:id',
//     validatorHandler(getUserSchema, 'params'),
//     async (req, res, next) => {
//         try {
//             const { id } = req.params;
//             const rta = await service.delete(id);
//             res.json(rta)
//         } catch (error) {
//             next(error)
//         }
//     }
// )


module.exports = router;