import { AppError } from "../utils/AppError.js";
import { catchError } from "./catchError.js";

export const allowedTo = (...roles)=>{
    return catchError(async(req,res,next)=>{
        if(!roles.includes(req.user.role))
            return next(new AppError('you are not authorized.',401))
        next()
    })
}