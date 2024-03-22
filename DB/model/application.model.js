import mongoose from 'mongoose';
const schema = new mongoose.Schema({   
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'job',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        secure_url: String,
        public_id: String
    }
},{timestamps: true}); 

export const applicationModel = mongoose.model('application', schema);
