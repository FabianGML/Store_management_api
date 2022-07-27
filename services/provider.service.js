const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');

const { models } = require('./../libs/sequelize');

class ProviderService {
    constructor(){}

    async find() {
        const rta = await models.Provider.findAll()
        return rta 
    }

    /*
    Se tendra que anexar los laboratorios y productos que 
     */
    async findOne(id) {
        const provider = await models.Provider.findByPk(id);
        if(!provider) {
            throw boom.badRequest('El proveedor no existe');
        }
        return provider
    }

    async create(data) {
        let name = data.name;
        name = name[0].toUpperCase() + name.substring(1).toLowerCase();
        let phone = data.phone  
        if(phone.length < 10 ) {
            phone.slice(0,2)
        }
        const newProvider = await models.Provider.create({
            ...data,
            name
        });
        return newProvider
    }

    async update(id, data) {
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

    async delete(id) {
        const provider = await this.findOne(id);
        await provider.destroy();
        return {
            message: `¡Proveedor ${provider.name} borrado!`
        }
    }
}

module.exports = ProviderService;