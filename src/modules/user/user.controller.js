import {userModel} from "../../../DB/model/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import { generateOTP } from "../../utils/generateOTP.js";
//----------------- SignUP 
export const signUp = catchError(async (req, res, next) => {
    // get data from the request body
    const { firstName, lastName, email, recoveryEmail, 
        password, DOB, phone, role } = req.body;
    //check if user exists or not
    let user = await userModel.findOne({$or:[{email}, {phone}]});
    if(user) return next(new AppError("Phone or Email already exists.",409));
    //add new user
    let data = new userModel({firstName, lastName, email, recoveryEmail, 
        password, DOB, phone, role});
    await data.save() ;
    res.json({message: "success",data});
}); 
//----------------- SignIn 
export const signIn = catchError(async(req,res,next)=>{
    // get data from the request body
    const { email, password, phone } = req.body;
    // check if user exists in db
    let user = await userModel.findOne({$or:[{email}, {phone}]});
    // if user not found or password incorrect
    if (!user) return next(new AppError("invalid user",401));
    if (!bcrypt.compareSync(password, user.password)) return next(new AppError("invalid password",401));
    // change status of user to online
    user.status = 'online';
    await user.save();
    // create token
    let token = jwt.sign({userId:user._id,role: user.role},process.env.JWT_KEY);
    // send response with token and user info
    return res.json({message: "success", token}); 
});
//----------------- Update User  
export const updateUser = catchError(
    async(req,res,next)=>{ 
        // get data from the request body
        const { firstName, lastName, email, recoveryEmail, DOB, phone } = req.body;
        // check update fields 
        const user = await userModel.findById(req.user._id);
        if (phone) {
            const phoneExist = await userModel.findOne({ phone });
            if (phoneExist) {
                return next(new AppError("phone already exist", 404));
            }
            user.phone = phone;
        }
        if (email) {
            const emailExist = await userModel.findOne({ email: email?.toLowerCase() });
            if (emailExist) {
                return next(new AppError("email already exist", 404));
            }
            user.email = email;
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (recoveryEmail) user.recoveryEmail = recoveryEmail; 
        if (DOB) user.DOB = DOB; 
        await user.save();
        res.json({message: "success"});
});
//----------------- Update Password    
export const updatePassword = catchError(
    async(req,res,next)=>{
        // get data from request body
        const { newPassword } = req.body;
        // check if user in db
        let user = await userModel.findById(req.user._id);
        if (!user) return next(new AppError("invalid user",404))
        // change password
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        await user.save();
        // create token and send it to client side
        let token = jwt.sign({userId:user._id,role: user.role},process.env.JWT_KEY)
        return res.json({message: "success", token})
    }
);
//----------------- Forget password & Reset password 
export const forgetPassword = catchError(async(req,res,next)=>{
    const user = await userModel.findById(req.user._id);
    if (user) {
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        await user.save();
        return res.json({ otp });
    }
    next (new AppError('User not found'));
});
export const resetPassword = catchError(async(req,res,next)=>{
    const user = await userModel.findOne({ resetPasswordOTP: req.body.otp });
    if (user) {
        user.password = req.body.newPassword;
        user.resetPasswordOTP = null;
        await user.save();
        let token = jwt.sign({userId:user._id,role: user.role},process.env.JWT_KEY)
        return res.json({ message: 'success', token });
    }
        return res.status(401).json({ message: 'Invalid OTP or email' });
});
//----------------- Delete account 
export const deleteUser = catchError( 
    async(req,res,next)=>{ 
        const user = await userModel.findByIdAndDelete(req.user._id);
        //  if make soft delete 
        // const user = await userModel.findByIdAndUpdate(req.user._id, { deleted: true }, { new: true });
        if (!user) {
            return next(new AppError("user not exist ", 404));
        }
        res.status(200).json({ message: "success" });
    }
);
//----------------- Get User Account 
export const getUserAccount = catchError(
    async(req,res,next)=>{ 
        const user = await userModel.findById(req.user._id);
        !user && next(new AppError("Not found.",404));
        user && res.json({message: "Success",user});
    }
);
//----------------- get Profile by anther user 
export const getUserByID = catchError(
    async (req, res, next) => { 
        const user = await userModel.findById(req.params.id).select("firstName lastName email DOB userName phone -_id");
        !user && next(new AppError("Not found.",404));
        user && res.json({message: "Success",user});
});
//----------------- Get all accounts to a specific recovery Email
export const getAccounts = catchError(
    async(req,res,next)=>{ 
        const { recoveryEmail } = req.body;
        const users = await userModel.find({ recoveryEmail}); 
        if (users.length === 0) {
            return next(new AppError("Not found.", 404));
        } 
        res.json({ message: "success", users });
    }
);