export const globalError = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    if(process.env.MODE == 'development'){
        res.status(err.statusCode).json({Error: err.message, Stack: err.stack})
    }else{
        res.status(err.statusCode).json({Error: err.message})
    }
}