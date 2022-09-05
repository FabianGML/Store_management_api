const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('./../../../config/config');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtKey
}

const JwtStrategy = new Strategy(options, (payload, done) => {
    return (null, payload)
})

module.exports = JwtStrategy