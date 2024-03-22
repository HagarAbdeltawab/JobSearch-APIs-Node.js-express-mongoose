import { globalError } from "../middleware/globalError.js"
import { AppError } from "../utils/AppError.js" 
import companyRouter from "./company/company.routes.js";
import jobRouter from "./job/job.routes.js";
import userRouter from "./user/user.routes.js";
export function bootstrap(app){ 
    app.use('/api/v1/users',userRouter);
    app.use('/api/v1/companies',companyRouter);
    app.use('/api/v1/jobs',jobRouter); 
    app.use('*',(req,res,next)=>{
        next(new AppError(`Not valid: ${req.originalUrl}`,404));
    })
    app.use(globalError);
}