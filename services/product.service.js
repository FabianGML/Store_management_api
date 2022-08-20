const boom = require('@hapi/boom');
const { Op } = require('sequelize');


const { models } = require('./../libs/sequelize');

const ProviderService = require('./provider.service');
const providerService = new ProviderService();

class ProductService {

    constructor() {}

    async getAllProducts() {
        const products = await models.Product.findAll({
            include: ['lab'],
            order: ['name']
        })
        return products
    }

    async getOneProduct(id) {
        const product = await models.Product.findByPk(id);
        if (!product) {
            throw boom.badRequest('El producto no existe');
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

    /* product-provider Servide */

    async getAllProductsProv(providerId) {
        const products = await models.ProductProvider.findAll({ 
            where: { providerId },
            include: ['product']
        })
        return products
    }

    async getOneProdProv(prodProvId) {
        const prodProv = await models.ProductProvider.findByPk(prodProvId);
        if (!prodProv) {
            throw boom.badRequest('El producto que buscas no existe')
        }
        return prodProv
    }

    async autoAddProdProv(providerId) {
        const provider = await providerService.getOneProvider(providerId);
        const labs = await models.LabProvider.findAll({ where: { providerId: provider.dataValues.id }});
        const labsIds = labs.map(lab => lab.dataValues.labId);

        for (const labId of labsIds) {
            let products = await models.Product.findAll({ where: { labId }});

            if(products.length >= 1){
                for(const product of products) {

                    const productProv = await models.ProductProvider.findOne({
                        where: {
                            [Op.and]: [
                                { providerId: provider.dataValues.id },
                                { productId: product.dataValues.id }
                            ]
                        }
                    })
                    if(!productProv) {
                        await models.ProductProvider.create({
                            productId: product.dataValues.id,
                            providerId: provider.dataValues.id
                        })        
                    }
                }
            }
            
        }
        return { message: `Productos relacionados con ${provider.dataValues.name} agregados correctamente`}
    }

    async addProdProv(providerId, data) {
        const provider = await providerService.getOneProvider(providerId);
        const products = []

        for (const productProv of data.productsProv){
            /* Making sure the product actually exist in the DB */
            const product = await this.getOneProduct(productProv.productId);
            /* If the product does exist then we push it into an array, if it's not, we discard it */
            if (product)  {
                products.push(productProv)
            }
            productProv.providerId = provider.dataValues.id
        }
        await models.ProductProvider.bulkCreate(products)
        return {
            message: `Productos agregados correctamente a ${provider.name}`
        }
    }

    async updateProdProv(providerId, prodProvId, data) {
        await providerService.getOneProvider(providerId);
        const prodProv = await this.getOneProdProv(prodProvId)
        await prodProv.update({
            productId: data.productId
        })
        return {
            message: 'Producto actualizado correctamente'
        }

    }
    async deleteProdProv(providerId, prodProvId) {
        await providerService.getOneProvider(providerId);   
        const prodProv = await this.getOneProdProv(prodProvId);
        console.log(prodProv)
        await prodProv.destroy();
        return {
            message: 'Producto eliminado correctamente'
        }
    }
}

module.exports = ProductService