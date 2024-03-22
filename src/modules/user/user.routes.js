import express from "express"; 
import * as U from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as S from "./user.validation.js";
import { protectRoutes } from "../../middleware/authentication.js"; 
import { allowedTo } from "../../middleware/authorization.js";
import { roles } from "../../common/constant/role.constant.js";
const userRouter = express.Router()
userRouter.post('/signUp', 
    validation(S.signUpSchemaVal), 
    U.signUp)

userRouter.post('/signIn', 
    validation(S.signInSchemaVal),
    U.signIn)

userRouter.route('/')
    .put(protectRoutes,
        allowedTo(roles.USER,roles.COMPANY_HR),
        validation(S.updateUserSchemaVal),
        U.updateUser)
    .delete(protectRoutes,
        U.deleteUser)
    .get(protectRoutes,
        U.getUserAccount)

userRouter.patch('/updatePassword',
    protectRoutes,
    allowedTo(roles.USER,roles.COMPANY_HR),
    validation(S.updatePasswordSchemaVal),
    U.updatePassword)

userRouter.patch('/forgetPassword',
    protectRoutes,
    allowedTo(roles.USER,roles.COMPANY_HR),
    U.forgetPassword)

userRouter.patch('/resetPassword',
    protectRoutes,
    allowedTo(roles.USER,roles.COMPANY_HR),
    validation(S.resetPasswordSchemaVal),
    U.resetPassword)

userRouter.get('/accounts', 
    validation(S.getAccountsSchemaVal),
    U.getAccounts)

userRouter.get('/:id',
    protectRoutes,
    validation(S.UserByIdSchemaVal),
    U.getUserByID)



export default userRouter;