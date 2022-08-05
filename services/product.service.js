const boom = require('@hapi/boom');
const sequelize = require('sequelize');

const { models } = require('./../libs/sequelize');

class ProductService {

    constructor() {}

    async getAllProducts() {
        const products = await models.Product.findAll({
            include: ['lab']
        })
        return products
    }

    async getOneProduct(id) {
        const product = await models.Product.findByPk(id);
        if (!product) {
            throw boom.badRequest('El usuario no existe');
        }
        return product;
    }

    async create(data) {
        let name = data.name;
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        const newProduct = await models.Product.create({
            ...data,
            name
        })
        return {
            message: `¡Producto ${newProduct.name} agregado correctamente`,
            data: newProduct
        }
    }

    async update(id, data) {
        let name = data.name;
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        const product = await this.getOneProduct(id);
        await product.update({
            name,
            ...data
        })
    }

    async delete(id) {
        const product = await this.getOneProduct(id);
        await product.destroy()
    }
}

module.exports = ProductService