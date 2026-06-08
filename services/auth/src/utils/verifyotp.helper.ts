import { AppError } from '@pulseshop/shared/error-handler';
import { sendOtp, trackOtpAttempts, trackOtpRequest, validateOtp } from './auth.helper.js';
import { Response,Request } from 'express';

export default async function verifyOtp(req:Request,res:Response){
    // OTP logic
    try{
        const {email} = req.body;
        
        if (!email) {
            return res.status(400).json({ status: 'failed', message: 'Email is required' });
        }

        await validateOtp(email);
        await trackOtpRequest(email);
        const otp = await sendOtp(email,"Verify OTP");
        await trackOtpAttempts(email,parseInt(otp));

        return res.status(200).json({
            status:'success',
            message:"OTP sent succesfully"
        });

    }catch(error)
    {
        console.log("error is :",error);
        if(error instanceof AppError)
        {
            return res.status(error.statusCode).json({
                status:'failed',
                description:error?.description,
                message : error.message
            });
        }
        return res.status(500).json({
            status:'failed',
            message:'InternalServerError'
        });
    }
}