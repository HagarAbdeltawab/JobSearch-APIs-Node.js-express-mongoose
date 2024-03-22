import Joi from 'joi'
export const createCompanyVal = Joi.object({
    companyName: Joi.string().trim().min(2).max(50).lowercase().required(),
    description: Joi.string().trim().min(10).max(300).required(),
    industry: Joi.string().trim().min(2).max(100).required(),
    companyEmail: Joi.string().email().trim().lowercase().required(),
    address: Joi.string().trim().required(),
    numberOfEmployees: Joi.number().max(20).min(11).required(),
    from: Joi.number().min(0).required(),
    to: Joi.number().min(0).required()
})

export const updateCompanyVal = Joi.object({
    id: Joi.string().hex().length(24),
    companyName: Joi.string().min(2).max(50).trim(),
    description: Joi.string().min(10).max(300).trim(),
    industry: Joi.string().min(2).max(100).trim(),
    companyEmail: Joi.string().email().trim(),
    address: Joi.string().trim(),
    numberOfEmployees: Joi.number().max(20).min(11),
    from: Joi.number().min(0),
    to: Joi.number().min(0)
})

export const paramIdVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const queryNameVal = Joi.object({
    name: Joi.string().min(2).max(50).required(),
})