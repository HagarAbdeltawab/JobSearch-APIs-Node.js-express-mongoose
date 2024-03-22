import express from "express";
import { protectRoutes } from "../../middleware/authentication.js";
import * as C from "./company.controller.js";
import { allowedTo } from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";
import * as S from "./company.validation.js";
import { roles } from "../../common/constant/role.constant.js";
const companyRouter = express.Router()
companyRouter.post('/',
        protectRoutes,
        allowedTo(roles.COMPANY_HR),
        validation(S.createCompanyVal),
        C.createCompany)

companyRouter.get("/search",
        protectRoutes,
        allowedTo(roles.COMPANY_HR,roles.USER),
        validation(S.queryNameVal), 
        C.searchCompany)

companyRouter.route('/:id')
    .put(protectRoutes,
        allowedTo(roles.COMPANY_HR),
        validation(S.updateCompanyVal),
        C.updateCompany)
        .delete(protectRoutes,
            allowedTo(roles.COMPANY_HR),
            validation(S.paramIdVal),
            C.deleteCompany)
        .get(protectRoutes,
            allowedTo(roles.COMPANY_HR),
            validation(S.paramIdVal),
            C.getCompanyData)

companyRouter.get("/applications/:id",
            protectRoutes,
            allowedTo(roles.COMPANY_HR),
            validation(S.paramIdVal), 
            C.getApplications)

export default companyRouter;