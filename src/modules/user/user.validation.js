import Joi from "joi"
import { roles } from "../../common/constant/role.constant.js"
export const signUpSchemaVal = Joi.object({
    firstName: Joi.string().trim().min(2).max(15).required(),
    lastName: Joi.string().trim().min(2).max(15).required(),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().trim().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    rePassword: Joi.valid(Joi.ref('password')).required(),
    DOB: Joi.string().required(),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    role: Joi.string().valid(...Object.values(roles))
})

export const signInSchemaVal = Joi.object({
    email: Joi.string().email().trim(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(), 
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/)
})

export const updateUserSchemaVal = Joi.object({
    firstName: Joi.string().trim().min(2).max(15),
    lastName: Joi.string().trim().min(2).max(15),
    email: Joi.string().email(),
    recoveryEmail: Joi.string().email().trim(),
    DOB: Joi.string(),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/)
})

export const updatePasswordSchemaVal = Joi.object({
    newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
})

export const resetPasswordSchemaVal = Joi.object({
    otp: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
})

export const UserByIdSchemaVal = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export const getAccountsSchemaVal = Joi.object({
    recoveryEmail: Joi.string().email().required()
})