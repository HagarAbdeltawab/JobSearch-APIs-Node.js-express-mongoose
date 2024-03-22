import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    jobTitle: {
        type: String,
        trim:true,
        required: true,
        minLength: [2, 'too short'],
        maxLength: [50, 'too long']
    },
    jobLocation: {
        type: String, 
        required: true,
        enum: ['onsite', 'remotely', 'hybrid']
    },
    workingTime: {
        type: String, 
        required: true,
        enum: ['part-time', 'full-time'], 
    },
    seniorityLevel: {
        type: String, 
        required: true,  
        enum: ['junior', 'mid-level', 'senior', 'team-lead', 'cto']
    },
    jobDescription: {
        type: String,
        trim:true,
        required: true,
        minLength: [3, 'too short'],
        maxLength: [300, 'too long']
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
},{timestamps: true,toJSON: {virtuals:true}});

schema.virtual('Company',{
    ref: 'company',
    localField: 'addedBy',
    foreignField: 'companyHR'
})
// return job with its company
schema.pre('find', function () {
    this.populate('Company')
})

export const jobModel = mongoose.model('job', schema);
