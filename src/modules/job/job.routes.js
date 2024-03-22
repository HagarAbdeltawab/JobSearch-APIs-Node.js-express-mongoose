import express from "express";
import * as J from "./job.controller.js";
import * as S from "./job.validation.js";
import { protectRoutes } from "../../middleware/authentication.js";
import { allowedTo } from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/fileUploads.js";
import { roles } from "../../common/constant/role.constant.js";
const jobRouter = express.Router()
jobRouter.route('/')
    .post(protectRoutes,
        allowedTo(roles.COMPANY_HR),
        validation(S.createJobVal),
        J.createJob)
    .get(protectRoutes,
        allowedTo(roles.USER,roles.COMPANY_HR),
        validation(S.queryNameVal), 
        J.getJobCompany)

jobRouter.route('/:id')
    .put(protectRoutes,
        allowedTo(roles.COMPANY_HR),
        validation(S.updateJobVal),
        J.updateJob)
    .delete(protectRoutes,
        allowedTo(roles.COMPANY_HR),
        validation(S.paramIdVal),
        J.deleteJob)

jobRouter.get("/company",
    protectRoutes,
    allowedTo(roles.USER,roles.COMPANY_HR), 
    J.getJobsCompany)

jobRouter.get("/filter",
    protectRoutes,
    allowedTo(roles.USER,roles.COMPANY_HR),
    validation(S.filterJobsVal), 
    J.filterJobs)

jobRouter.post("/applyJob/:jobId",
    protectRoutes,
    allowedTo(roles.USER),
    fileUpload('file'), 
    validation(S.applyJobVal),
    J.applyJob)

export default jobRouter;