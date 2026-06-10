import { BadRequestError } from '@pulseshop/shared/error-handler';
import { sendOtp, trackOtpAttempts, trackOtpRequest, validateOtp } from './auth.helper.js';


export default async function verifyOtp(email:string,otp:string){
    // OTP logic
    try{        
        if (!email) {
            throw new BadRequestError("Email is required");
        }
        console.log(email);
        await validateOtp(email);

        await trackOtpRequest(email);
        
        await trackOtpAttempts(email,parseInt(otp));

    }catch(error:any)
    {
        console.log("error is :",error);
        throw new BadRequestError(error.message);
    }
}