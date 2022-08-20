const boom = require('@hapi/boom');
const sequelize = require('sequelize');


const { models } = require('./../libs/sequelize');

class OrderService {
    
    constructor() {}

    /* This method checks if the product name exist in the db
        data - most have items property that includes an array of objects, each object belongs to each product we need to create in db  
    */
    async productExist(data, orderId) {
        const items = []
        for(const item of data.items) {
            let name = item.name
            name = name[0].toUpperCase() + name.substring(1).toLowerCase();
            const product = await models.Product.findOne({ where: { name } })
            
            /* If the product the user passed doesn't exist, we create it with some defualts values  */
            if(!product) {  
                const newProduct = await models.Product.create({
                    name,
                    price: 0.1,
                    stock: item.amount,
                    line: 'Nuevo',
                    labId: 2,
                    expiration: item.expiration,
                    userId: 2
                })
                item.productId = newProduct.id;
            }

            /* If the product actualy exist in the db, we update it wheter the changes the user wanted */
            if (product) {
                const expiration = item.expiration > product.expiration ? item.expiration : product.expiration
                product.update({
                    stock: product.stock + item.amount,
                    expiration,
                    expiration2: product.expiration
                });
                item.productId = product.id;
            }
            item.orderId = orderId;
            items.push(item)
        }   

        return items
    }
     
    async getOrders() {
        const orders = await models.Order.findAll({
            order: [['orderArrive', 'DESC']],
            include: ['provider']
        });
        return orders
    }

    /*
    Se tendra que incluir la informacion de la tabla orders_products 
     */
    async getOneOrder(id) {
        const order = await models.Order.findByPk(id, {
            include: ['items']
        });
        if (!order) {
            throw boom.badRequest('La orden no existe');
        }
        return order; 
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
        
        await this.addItem(data, order.id)
        
        return {
            message: `Orden numero ${order.id} agregado exitosamente!`
        }
    }

    
    async updateOrder(id, data) {
        const order = await this.getOneOrder(id);
        await order.update(data);
        return {
            message: '¡La orden cambio correctamente!'
        }
    }

    async deleteOrder(id) {
        const order = await this.getOneOrder(id);
        await order.destroy();
        return {
            message: `Orden numero ${order.id} borrada!`
        }
    }

    // Orders-Products service 
    
    async addItem(data, orderId) {

        const product = await this.productExist(data, orderId);
        // inserting a bulk of products at once depends on how many products do we want to add 
        await models.OrderProduct.bulkCreate(product);
    }

    async findOneItem(id) {
        const item = await models.OrderProduct.findByPk(id);
        if (!item) {
            throw boom.badRequest('El producto no existe');
        }
        return item
    }

    async updateItem(orderId, itemId ,data) {
        /*
         Making sure the item actualy exist in the db
         */
        const item = await this.findOneItem(itemId);

        const product = await models.Product.findByPk(item.productId);
        if(!product) {
            throw boom.badRequest('El producto no existe')
        }
        /*
            Checking wheter or not the name passed by the body and the name in the db matches
        */
        const dataItem = data.items[0]
        let name = dataItem.name
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        
        /* If the name passed by the user is different, we need to remove the incoming amount to the product stock  */
        if(name !== product.dataValues.name){
            const stock = product.stock - item.dataValues.amount
            await product.update({
                stock
            })
            const items = await this.productExist(data, orderId) //this checks if the product exist or not
            await item.update({
                ...items[0],
                productId: items[0].productId,
                totalPrice: items[0].amount * items[0].unitPrice
            })
        }else {
            const rawData = data.items[0]
            const stock = product.stock + (rawData.amount - item.dataValues.amount)
            await product.update({
                stock
            })
            await item.update({
                ...rawData,
                productId: product.id,
                totalPrice: rawData.amount * rawData.unitPrice
            });
        }

        /* Calculate again the order total */

        const itemOrder = await models.OrderProduct.findAll({ where: { orderId }});
        
        // adding all the total prices to get the total of the entire order and put it in the order Table 
        const total = (itemOrder.map(({totalPrice}) => totalPrice)).reduce((total, price) => total + price,0);


        const order = await models.Order.findByPk(orderId)
        order.update({
            total
        });

        return {
            message: `Producto ${name} actualizado`
        }
    }   

    async deleteItem(orderId, itemId) {
        const item = await this.findOneItem(itemId);
        await item.destroy();
        const itemOrder = await models.OrderProduct.findAll({ where: { orderId }});
        
        // adding all the total prices to get the total of the entire order and put it in the order Table 
        const total = (itemOrder.map(({totalPrice}) => totalPrice)).reduce((total, price) => total + price,0);

        const order = await models.Order.findByPk(orderId)
        order.update({
            total
        });

        return {
            message: 'Se elimino el producto correctamente'
        }
    }
}

module.exports = OrderService