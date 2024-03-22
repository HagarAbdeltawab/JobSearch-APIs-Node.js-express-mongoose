import { applicationModel } from "../../../DB/model/application.model.js";
import { companyModel } from "../../../DB/model/company.model.js";
import { jobModel } from "../../../DB/model/job.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
import cloudinary from 'cloudinary';
//------------- Add Job
export const createJob= catchError(
    async(req,res,next)=>{
        const { jobTitle, jobLocation, workingTime, seniorityLevel, 
            jobDescription, technicalSkills, softSkills } = req.body;
        const job = await jobModel.create({
            jobTitle, jobLocation, workingTime, seniorityLevel,
            jobDescription, technicalSkills,
            softSkills, addedBy: req.user._id});
        await job.save();
        res.json({message: "success", job});
    }
)
//------------- Update Job
export const updateJob= catchError(
    async(req,res,next)=>{ 
        const { jobTitle, jobLocation, workingTime, seniorityLevel,
            jobDescription, technicalSkills, softSkills } = req.body;
        const job = await jobModel.findOne({ _id: req.params.id, addedBy: req.user._id })
        if (!job) return next(new AppError("job not exist or you are not owner!", 400))
        if (jobTitle) job.jobTitle = jobTitle;
        if (jobLocation) job.jobLocation = jobLocation;
        if (workingTime) job.workingTime = workingTime;
        if (seniorityLevel) job.seniorityLevel = seniorityLevel;
        if (jobDescription) job.jobDescription = jobDescription;
        if (softSkills) job.softSkills = softSkills;
        if (technicalSkills) job.technicalSkills = technicalSkills;
        await job.save();
        res.json({message: "success",job});
    }
)
//------------- Delete Job
export const deleteJob= catchError(
    async(req,res,next)=>{  
        let job = await jobModel.findByIdAndDelete({_id: req.params.id, addedBy: req.user._id })
        !job && next(new AppError("Not found.",404))
        job && res.json({message: "Success",job})
    }
)
//------------- Get all Jobs with their company’s information.
export const getJobsCompany = catchError(
    async(req,res,next)=>{ 
        const jobs = await jobModel.find({})
        let results = []
        for (const job of jobs) {
            const company = await companyModel.find({ companyOwner: job.addedBy })
            let objJob = job.toObject()
            objJob.company = company
            results.push(objJob)
        }
        res.json({message: "Success",results})
    }
);

//------------- Get all Jobs for a specific company.
export const getJobCompany = catchError(async (req, res, next) => {
    const company = await companyModel.findOne({ companyName: req.query.name.toLowerCase()});
    if (!company)   return next(new AppError("company not exist !", 404));
    const jobs = await jobModel.find({ addedBy: company.companyOwner });
    res.json({ message: "success", jobs });
});

//------------- Get all Jobs that match the following filters    
export const filterJobs = catchError(async (req, res, next) => {
    let filterQuery = {};
    if (req.query?.jobTitle) {
        filterQuery.jobTitle = req.query.jobTitle;
    }
    if (req.query?.jobLocation) {
        filterQuery.jobLocation = req.query.jobLocation;
    }
    if (req.query?.workingTime) {
        filterQuery.workingTime = req.query.workingTime;
    }
    if (req.query?.seniorityLevel) {
        filterQuery.seniorityLevel = req.query.seniorityLevel;
    }
    if (req.query?.technicalSkills) {
        filterQuery.technicalSkills = req.query.technicalSkills;
    }
    const jobs = await jobModel.find(filterQuery);
    res.json({ message: "success", jobs });
});

//------------- Apply to Job
export const applyJob = catchError(async (req, res, next) => {
    const { userSoftSkills, userTechSkills } = req.body;
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId);
    if (!job) return next(new AppError("job not exist !", 404));
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "exam/user"
    });
    const application = await applicationModel.create({
        userSoftSkills, userTechSkills,
        userId: req.user._id, jobId,
        userResume: { secure_url, public_id }
    });
    res.json({ message: "Success", application });
})