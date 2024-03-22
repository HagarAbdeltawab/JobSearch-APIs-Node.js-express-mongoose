import {userModel} from "../../DB/model/user.model.js";
import { AppError } from "../utils/AppError.js"
import { catchError } from "./catchError.js"
import jwt from "jsonwebtoken";

export const protectRoutes = catchError(async(req,res,next)=>{
    let {token} = req.headers;
    //token exist or not
    if(!token) return next(new AppError('token not provided', 401));
    //verify token
    let decoded = jwt.verify(token,process.env.JWT_KEY)
    if (!decoded) {
        return next(new AppError('invalid signature', 401));
    }
    // if (!decoded.id) {
    //     return next(new AppError( 'invalid token payload', 401));
    // } 
    //userId exist or not
    let user = await userModel.findById(decoded.userId).select("-password")
    if(!user) return next(new AppError('user not found',401))
    // check if user login
    if (user.status === 'offline') {
        return res.status(404).json({ msg: "please log in first" })
    }
    // password change after this token 
    if(user.passwordChangedAt && parseInt(user.passwordChangedAt.getTime() / 1000) > decoded.iat) 
        return next(new AppError('invalid token.. login again',401))  
    // check if user logout after this token
    if (user.logoutTime && decoded.iat < user.logoutTime.getTime() / 1000) {
        return next(new AppError('Token issued after user logged out. Please log in again', 401));
    }
    // if (user.isConfirmed == false) {
    //     return res.status(404).json({ msg: "please confirm first" })
    // } 
    req.user = user
    next()
}) 