import crypto from "crypto"; 

export const generateOTP = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); 
};