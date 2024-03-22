import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    companyName: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        lowercase: true,
        minLength: [2, 'too short'],
        maxLength: [50, 'too long']
    },
    description: {
        type: String,
        trim:true,
        required: true,
        minLength: [10, 'too short'],
        maxLength: [300, 'too long']
    },
    industry: {
        type: String,
        trim:true,
        required: true,
        minLength: [2, 'too short'],
        maxLength: [100, 'too long']
    },
    address: {
        type: String,
        trim:true,
        required: true
    },
    numberOfEmployees: {
        from: { type: Number, min: 0 },
        to: { type: Number, min: 0 },
    },
    companyEmail: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        lowercase: true
    },
    companyOwner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{ timestamps: true });

export const companyModel = mongoose.model('company', schema);