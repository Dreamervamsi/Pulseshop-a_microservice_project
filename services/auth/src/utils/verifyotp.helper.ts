import { NextFunction,Request,Response } from "express";
import { sendOtp, trackOtpAttempts, trackOtpRequest, validateOtp } from './auth.helper.js';
import {checkEmailType} from '@pulseshop/shared/types';

export default async function verifyOtp(req:Request,res:Response,next:NextFunction){
    const { email,otp } :checkEmailType  = req.body;
    
    // OTP logic
    await validateOtp(email,next);
    await trackOtpRequest(email,next);
    await sendOtp(email,"Verify OTP");
    await trackOtpAttempts(email,otp,next);
    
    res.status(200).json({
        'message':"OTP sent to email, Please verify it"
    });
}