import mongoose from "mongoose";
export function dbConnection (){
    mongoose.connect('mongodb://127.0.0.1:27017/JobSearch')
    .then(_ => console.log("DB connected successfully"))
    .catch(err => console.log(err))
}