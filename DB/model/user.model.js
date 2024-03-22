import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import { roles } from '../../src/common/constant/role.constant.js';
import { status } from '../../src/common/constant/status.constant.js';
const schema = new mongoose.Schema({
    firstName: {
        type: String,
        trim:true,
        required: true,
        minLength: [2, 'too short'],
        maxLength: [15, 'too long']
    },
    lastName: {
        type: String,
        trim:true,
        required: true,
        minLength: [2, 'too short'],
        maxLength: [15, 'too long']
    },
    userName: {
        type: String,
        minlength: 4,
    },
    email: {
        type: String,
        trim:true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String,
        trim:true,
        lowercase: true,
        required: true,
    },
    DOB: {
        type: Date,
        required: true
    },
    phone: {
        type: String, 
        required: true,
        unique: true
    },
    role: {
        type: String, 
        required: true, 
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.OFFLINE
    },
    passwordChangedAt: Date,
    resetPasswordOTP: String,
},{timestamps:true});

schema.pre('save', function () {
    // full username 
    if (this.isModified('firstName') || this.isModified('lastName')) { 
        this.userName = `${this.firstName} ${this.lastName}`;
    }
    // hash password   
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 8);
    } 
}); 

export const userModel = mongoose.model('user', schema);

