const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { config } = require('./../config/config');
const UserService = require('./user.service');

const service = new UserService();

class AuthService {
    constructor(){}

    async verifyUser(email, password ) {
        const user = await service.getUserByEmail(email);
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            throw boom.unauthorized();
        }
        delete user.dataValues.password;
        delete user.dataValues.recoverToken;
        return user
    }

    signToken(user) {
        const payload = {
            sub: user.id,
            role: user.role
        }
        const token = jwt.sign(payload, config.jwtKey);
        return {
            user,
            token  
        }
    }
}


module.exports = AuthService;