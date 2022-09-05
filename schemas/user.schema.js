const Joi = require('joi');

const id = Joi.number().positive().required();
const name = Joi.string().min(3);
const lastName = Joi.string().min(3);
const role = Joi.string().min(5);
const email = Joi.string().email();
const repeatEmail = Joi.string().email();
const password = Joi.string().min(6).max(20);
const repeatPassword = Joi.string();
const newPassword = Joi.string().min(6).max(20);

const createUserSchema = Joi.object({
    name: name.required(),
    lastName: lastName.required(),
    role: role.required(),
    email: email.required(),
    repeatEmail: repeatEmail.required(),
    password: password.required(),
    repeatPassword: repeatPassword.required(),
})

const updateFullNameUserSchema = Joi.object({
    name,
    lastName
})

const changePrivateSchema = Joi.object({   
    password: password.required(),
    email,
    repeatEmail,
    newPassword,
    repeatPassword 
})
.with('newPassword', ['password', 'repeatPassword'])
.with('email', ['password', 'repeatEmail'])

const getUserSchema = Joi.object({
    id
})


module.exports = { createUserSchema, updateFullNameUserSchema, changePrivateSchema, getUserSchema };