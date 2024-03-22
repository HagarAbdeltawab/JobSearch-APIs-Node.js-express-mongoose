import { applicationModel } from "../../../DB/model/application.model.js";
import { companyModel } from "../../../DB/model/company.model.js";
import { jobModel } from "../../../DB/model/job.model.js"; 
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
//------------- Add company
export const createCompany = catchError(
    async(req,res,next)=>{
        //get the data from the body of the request
        const { companyName, description, industry, address, from, to, companyEmail } = req.body;
        // check company name exist
        const nameExist = await companyModel.findOne({ companyName: companyName.toLowerCase() });
        if (nameExist) return next(new AppError("name already exist ", 400));
        // check company email exist
        const emailExist = await companyModel.findOne({ companyEmail: companyEmail.toLowerCase() });
        if (emailExist) return next(new AppError("companyEmail already exist ", 400));
        // create new company
        let company = await companyModel.create({
            companyName, description, industry, address,
            numberOfEmployees: { from, to }, companyEmail,
            companyOwner: req.user._id
        });
        res.json({message: "success",company});
    }
);
//------------- Update company data
export const updateCompany = catchError(
    async(req,res,next)=>{ 
        // get data from request body
        const { companyName, description, industry, address, from, to, companyEmail } = req.body;
        //check company exist
        const company = await companyModel.findOne({ _id: req.params.id, companyOwner: req.user._id });
        if (!company) return next(new AppError("company not exist or you are not owner!", 400));
        //update fields in db
        if (companyName) { 
            const nameExist = await companyModel.findOne({ companyName: companyName.toLowerCase() });
            if (nameExist)  return next(new AppError("name already exist before", 400));
            company.companyName = companyName;
        } 
        if (description) company.description = description; 
        if (industry) company.industry = industry;
        if (address) company.address = address;
        if (from) company.numberOfEmployees.from = from;
        if (to) company.numberOfEmployees.to = to; 
        if (companyEmail) { 
            const companyEmailExist = await companyModel.findOne({ companyEmail: companyEmail.toLowerCase() });
            if (companyEmailExist) return next(new AppError("companyEmail already exist ", 400));
            company.companyEmail = companyEmail;
        }
        await company.save();
        res.json({message: "success",company});
    }
);
//------------- Delete company data
export const deleteCompany = catchError(
    async(req,res,next)=>{ 
        const company = await companyModel.findOneAndDelete({ 
            _id: req.params.id, companyOwner: req.user._id });
        !company && next(new AppError("Not found.",404));
        company && res.json({message: "Success",company});
    }
)
//------------- Get company data 
export const getCompanyData = catchError(
    async(req,res,next)=>{ 
        //check company exist
        const company = await companyModel.findOne({ _id: req.params.id, companyOwner: req.user._id });
        if (!company) return next(new AppError("company not exist or you are not owner!", 400));
        //all jobs related
        const jobs = await jobModel.find({ addedBy: company.companyOwner })
        //company with jobs
        let data = company.toObject()
        data.jobs = jobs;
        res.json({message: "Success",data})
    }
)
//------------- Search for a company with a name
export const searchCompany = catchError(
    async(req,res,next)=>{  
        const company = await companyModel.findOne({ companyName: req.query.name.toLowerCase() });
        !company && next(new AppError("Not found.",404));
        company && res.json({message: "Success",company});
    }
)

//------------- Get all applications for specific Jobs
export const getApplications = catchError(
    async(req,res,next)=>{ 
        //check job exist
        const job = await jobModel.findOne({ _id: req.params.id, addedBy: req.user._id });
        if (!job) return next(new AppError("job not exist yet !", 404));
        //job with applications
        const applications = await applicationModel.find({ jobId: job._id });
        let data = job.toObject();
        data.applications = applications;
        res.json({message: "Success",data});
    }
);