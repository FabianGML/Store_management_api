const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');

const { models } = require('./../libs/sequelize');


class UserService {

    constructor(){}

    async getAllUsers() {
        const rta = await models.User.findAll({
            order: sequelize.col('id')
        });

        const users = rta.map(user => {
            delete user.dataValues.password
            return user
        })
        console.log(users)
        return users;
    }

    /* The function return only the user data */
    async getOneUser(id) {
        const user = await models.User.findByPk(id);
        if(!user){
            throw boom.notFound('No se encontro el usuario');
        }
    }

    /* Returns the current user and it's sales  */
    async getOneProfile(id) {
        const user = await this.getOneUser(id);
        const sales = await models.Sale.findAll({where: {userId: id}})
        delete user.dataValues.password
        return {
            user,
            sales
        };
    }
    
    async getUserByEmail(email) {
        const user = await models.User.findOne({where: { email }});
        if (!user){
            throw boom.unauthorized();
        }
        return user
    }

    async create(data) {
        const password = data.password;
        const repeatPass = data.repeatPassword;
        if(password !== repeatPass){
            throw boom.badRequest('La contraseña no coincide')
        }
        if(data.email !== data.repeatEmail) {
            throw boom.badRequest('Los correos no coinciden')
        }
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await models.User.create({
            ...data,
            password: hash
        })
        delete newUser.dataValues.password
        return newUser
    }

    async updateFullName(id, data) {
        const user = await this.getOneUser(id);
        const rta = await user.update(data);
        delete rta.dataValues.password
        delete rta.dataValues.email
        delete rta.dataValues.role
        return rta;
    }

    async updatePrivate(id, changes) {
        const user = await this.getOneUser(id);
        const password = changes.password;
        const isMatch = await bcrypt.compare(password, user.password);
        const rta = {}
        const newPassword = changes.newPassword;
        if (!isMatch) {
            throw boom.unauthorized('Por favor, Ingresa la contraseña correcta');
        }
        if(newPassword) {
            
            if (newPassword !== changes.repeatPassword) {
                throw boom.badRequest('Las contraseñas no son iguales')
            }
            const hash = await bcrypt.hash(newPassword, 10);
            await user.update({
                password: hash
            })
            rta.passMessage = 'La contraseña se cambio correctamente';
        }
        if(changes.email ) {
            if (changes.email !== changes.repeatEmail) {
                throw boom.badRequest('Los correos no coinciden')
            }
            await user.update({
                email: changes.email,
            })
            rta.emailMessage = 'El correo se cambio correctamente'
        }
        return rta;
    }

    async delete(id) {
        const user = await this.findOne(id);
        const name = user.dataValues.name;
        const lastName = user.dataValues.lastName;
        await user.destroy();
        return {
            message: `Se elimino el usuario ${name} ${lastName}`
        }
    }
}


module.exports = UserService