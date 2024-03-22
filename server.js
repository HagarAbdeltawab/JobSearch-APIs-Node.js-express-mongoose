process.on('uncaughtException', err=> console.log(err))
import express from 'express'; 
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';
import { bootstrap } from './src/modules/index.routes.js';
import { dbConnection } from './DB/dbConnection.js';
const app = express()
const port = 3000 
dotenv.config();
dbConnection();
app.use(express.json()); 
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});
bootstrap(app)
process.on('unhandledRejection', err=> console.log(err))  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))