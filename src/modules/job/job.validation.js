import Joi from 'joi'
import { workTime } from '../../common/constant/workTime.constant.js'
import { seniorityLevel } from '../../common/constant/seniorityLevel.constant.js'
import { jobLocation } from '../../common/constant/jobLocation.constant.js'
export const createJobVal = Joi.object({
    jobTitle: Joi.string().trim().min(2).max(50).required(),
    jobLocation: Joi.string().lowercase().valid(...Object.values(jobLocation)).required(),
    workingTime: Joi.string().lowercase().valid(...Object.values(workTime)).required(),
    seniorityLevel: Joi.string().lowercase().valid(...Object.values(seniorityLevel)).required(),
    jobDescription: Joi.string().trim().min(10).max(300).required(),
    technicalSkills: Joi.array().items(Joi.string().trim()).required(),
    softSkills: Joi.array().items(Joi.string().trim()).required(),
})

export const updateJobVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    jobTitle: Joi.string().trim().min(2).max(50),
    jobLocation: Joi.string().lowercase().valid(...Object.values(jobLocation)),
    workingTime: Joi.string().lowercase().valid(...Object.values(workTime)),
    seniorityLevel: Joi.string().lowercase().valid(...Object.values(seniorityLevel)),
    jobDescription: Joi.string().trim().min(10).max(300),
    technicalSkills: Joi.array().items(Joi.string().trim()),
    softSkills: Joi.array().items(Joi.string().trim()),
})

export const paramIdVal = Joi.object({
    id: Joi.string().hex().length(24)
})

export const queryNameVal = Joi.object({
    name: Joi.string().min(2).max(50).required(),
})
export const filterJobsVal = Joi.object({ 
    jobTitle: Joi.string().trim().min(2).max(50),
    jobLocation: Joi.string().lowercase().valid(...Object.values(jobLocation)),
    workingTime: Joi.string().lowercase().valid(...Object.values(workTime)),
    seniorityLevel: Joi.string().lowercase().valid(...Object.values(seniorityLevel)), 
    technicalSkills: Joi.array().items(Joi.string().trim()),
    softSkills: Joi.array().items(Joi.string().trim()),
})

export const applyJobVal = Joi.object({
    userSoftSkills: Joi.array().items(Joi.string().required()).required(),
    userTechSkills: Joi.array().items(Joi.string().required()).required(),
    jobId: Joi.string().hex().length(24).required(),
    userResume: Joi.object().keys({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required(),
    }).required(),
})