const boom = require('@hapi/boom');
const sequelize = require('sequelize');
const { Provider } = require('../db/models/provider.model');

const { models } = require('./../libs/sequelize');

class OrderService {
    
    constructor() {}

    
    async find() {
        const orders = await models.Order.findAll({
            order: [['orderArrive', 'DESC']],
            include: ['provider']
        })
        return orders
    }

    /*
    Se tendra que incluir la informacion de la tabla orders_products 
     */
    async getOneOrder(id) {
        const order = await models.Order.findByPk(id);
        if (!order) {
            throw boom.badRequest('La orden no existe');
        }
        return order; // Se le agregara todos los detalles de la orden
    }

    async createOrder(data) {
        /*
            Making sure the provider actually exist in the database
         */
        const provider = await models.Provider.findByPk(data.providerId);
        if(!provider) {
            throw boom.badRequest('El proveedor no existe')
        }
        
        /*
            Multiplying the amount of products that arrived in order to get the totalPrice of each product
         */
        data.items.forEach(item => {
            item.totalPrice = item.amount * item.unitPrice
        })
        // adding all the total prices to get the total of the entire order and put it in the order Table 
        const total = (data.items.map(({totalPrice}) => totalPrice)).reduce((total, price) => total + price,0);

        //Create the order first as to get the order id that we need to pass it to the order_product table 
        const order = await models.Order.create({
            providerId: data.providerId,
            orderArrive: data.orderArrive,
            total
        })

        //adding the order id to each product 
        data.items.forEach(element => {
            element.orderId = order.id
        });

        data.items.forEach(async item => {
            let name = item.name
            name = name[0].toUpperCase() + name.substring(1).toLowerCase();
            const product = await models.Product.findOne({ where: { name } })
            
            if(!product) {  
                const newProduct = await models.Product.create({
                    name,
                    price: 0.1,
                    stock: item.amount,
                    line: 'Nuevo',
                    labId: 2,
                    expiration: item.expiration,
                    userId: 1
                })
                item.productId = newProduct.id
            }
            if (product) {
                const expiration = item.expiration > product.expiration ? item.expiration : product.expiration
                product.update({
                    stock: product.stock + item.amount,
                    expiration,
                    expiration2: product.expiration
                });
                item.productId = product.id
            }
        })
        console.log(data.items);  
        // inserting a bulk of products at once depends on how many products do we want to add 
        await models.OrderProduct.bulkCreate(data.items)
        
        
        return {
            message: `Orden numero ${order.id} agregado exitosamente!`
        }
    }

    async addItem() {
        
    }

    async update(id, data) {
        const order = await this.findOne(id);
        await order.update(data);
        return {
            message: '¡La orden cambio correctamente!'
        }
    }

    async delete(id) {
        const order = await this.findOne(id);
        await order.destroy();
        return {
            message: `Orden numero ${order.id} borrada!`
        }
    }

    // Orders-Products service 
    async updateItem(id, data) {
        /**
         Making sure the item actualy exist in the db
         */
        const item = await models.OrderProduct.findByPk(id);
        if (!item) {
            throw boom.badRequest('El producto no existe');
        }
        /*
            Checking wheter or not the name passed by the body and the name in the db matches
         */
        let name = item.name
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        if(item.name !== data.name){
            const product = await models.Product.update({
                stock: stock - item.amount
            })
        }else {
            const product = await models.Porduct.update({
                stock: this.stock + (data.amount - item.amount),
                unitPrice: data.unitPrice
            })
        }
        // await models.OrderProduct.findAll({
        //     where: {
        //         orderId: data.
        //     }
        // })
        return {
            message: `Producto ${item.name} actualizado`
        }
    }   
}

module.exports = OrderService