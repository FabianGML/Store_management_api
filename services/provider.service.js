const boom = require('@hapi/boom');


const { models } = require('./../libs/sequelize');

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
            include: ['labsProv'],
            order: ['name']
        })
        return rta 
    }

    async getOneProvider(id) {
        const provider = await models.Provider.findByPk(id);
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
    
    async updateLab(providerId, labProvId, data) {
        const provider = await this.getOneProvider(providerId);
        const labProv = await this.getOneLabProv(labProvId);

        const lab = await this.labExist(data.labs, providerId);
        await labProv.update({
            labId: lab[0].labId
        })
        return {
            message: 'Laboratorio actualizado con exito'
        }
    }

    async deleteLab(providerId, labProvId) {
        const provider = await this.getOneProvider(providerId);
        const labProv = await this.getOneLabProv(labProvId);
        await labProv.destroy()
        return{
            message: `Laboratorio eliminado del proveedor ${provider.dataValues.name}`
        }
    }
    
}

module.exports = ProviderService;