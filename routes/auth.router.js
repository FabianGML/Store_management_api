const express = require('express');
const passport = require('passport')

const AuthService = require('./../services/auth.service');

const router = express.Router();
const service = new AuthService();

/* Login to so sign the token and get access to the api */
router.post('/login', 
passport.authenticate('local', {session: false}),
    async (req, res, next) => {
        try {
            const user = req.user;
            res.json(service.signToken(user))
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router