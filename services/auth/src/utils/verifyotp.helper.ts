import { NextFunction } from "express";
import { sendOtp, trackOtpAttempts, trackOtpRequest, validateOtp } from './auth.helper.js';

export default async function verifyOtp(email:string,next:NextFunction){
    // OTP logic
        await validateOtp(email,next);
        await trackOtpRequest(email,next);
        const otp = await sendOtp(email,"Verify OTP");
        await trackOtpAttempts(email,parseInt(otp),next);

}