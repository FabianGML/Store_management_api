const boom = require('@hapi/boom');
const { Op } = require('sequelize')

const { models } = require('./../libs/sequelize');
const ProductService = require('./product.service');

const productService = new ProductService();

class ProviderService {
    constructor(){}

    async labExist(data, providerId) {
        const labs = []
        for(const lab of data) {
            let name = lab.labName;
            name = name[0].toUpperCase() + name.substring(1).toLowerCase();
            
            const dbLab = await models.Lab.findOne({ where: { name }})
            
            if(!dbLab) {
                const newLab = await models.Lab.create({
                    name
                })
                lab.labId = newLab.dataValues.id
            }else {
                lab.labId = dbLab.dataValues.id   
            }
            lab.providerId = providerId
            labs.push(lab)
        }
        return labs
    }
    async getProviders() {
        const rta = await models.Provider.findAll({
            include:['labsProv']
        })
        return rta 
    }

    async getOneProvider(id) {
        const provider = await models.Provider.findByPk(id, {
            include: ['labsProv', 'prodProv']
        });
        if(!provider) {
            throw boom.badRequest('El proveedor no existe');
        }
        return provider
    }

    async createProvider(data) {
        let name = data.name;
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        const newProvider = await models.Provider.create({
            name,
            email: data.email,
            phone: data.phone,
            phone2: data.phone2,
        });
        const labs = await this.labExist(data.labs, newProvider.dataValues.id);
        console.log(labs)
        await models.LabProvider.bulkCreate(labs);
        return {
            message: `Proveedor ${newProvider.name} agregado correctamente`
        }
    }

    async updateProvider(id, data) {
        const provider = await this.findOne(id);
        let name = data.name;
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        console.log(name);
        await provider.update({
            ...data, 
            name
        });
        return {
            message: '¡El proveedor cambio correctamente!'
        }
    }

    async deleteProvider(id) {
        const provider = await this.findOne(id);
        await provider.destroy();
        return {
            message: `¡Proveedor ${provider.name} borrado!`
        }
    }
    /* LabProvider Service */
    async addLab(data, providerId) {
        const provider = await this.getOneProvider(providerId)
        const labs = await this.labExist(data.labs, providerId);
        await models.LabProvider.bulkCreate(labs)
        if (labs.length > 1){
            return { message: `Laboratorio agregado al proveedor ${provider.dataValues.name}`}
        }
        return { message: `Laboratorios agregados al proveedor ${provider.dataValues.name}`}
    }

    async getOneLabProv(labProvId) {
        const labProv = await models.LabProvider.findByPk(labProvId);
        if (!labProv) {
            throw boom.badRequest(`El laboratorio no existe para el proveedor ${provider.dataValues.name}`)
        }
        return labProv
    }

    async deleteLab(providerId, labProvId) {
        const provider = await this.getOneProvider(providerId);
        const labProv = await this.getOneLabProv(labProvId);
        await labProv.destroy()
        return{
            message: `Laboratorio eliminado del proveedor ${provider.dataValues.name}`
        }
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
        const provider = await this.getOneProvider(providerId);
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
        const provider = await this.getOneProvider(providerId);
        const products = []

        for (const productProv of data.productsProv){
            /* Making sure the product actually exist in the DB */
            const product = await productService.getOneProduct(productProv.productId);
            /* If the product does exist then we push it into the array, if it's not, we discard it */
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
        await this.getOneProvider(providerId);
        const prodProv = await this.getOneProdProv(prodProvId)
        await prodProv.update({
            productId: data.productId
        })
        return {
            message: 'Producto actualizado correctamente'
        }

    }
    async deleteProdProv(prodProvId) {
        const prodProv = await this.getOneProdProv(prodProvId);
        await prodProv.destroy();
        return {
            message: 'Producto eliminado correctamente'
        }
    }
    
}

module.exports = ProviderService;