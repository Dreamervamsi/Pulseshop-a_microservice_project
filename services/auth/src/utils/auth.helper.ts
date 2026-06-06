import { prisma } from "../models/user.model";
import { BadRequestError } from "@pulseshop/shared/error-handler";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from "@pulseshop/shared/index";
import { sendEmail } from "./sendEmail";
import {NextFunction} from 'express';

export async function checkUserExists(email:string){
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!isUserExists) {
        throw new BadRequestError('User already exists');
    }
}

export const createUser = async(name:string,email:string,hashedPassword:string)=>{
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return {user,token};
}

export const trackOtpRequest = async(email:string,next:NextFunction)=>{
    const otpReqCount = parseInt(await redis.get(`otp-req-count:${email}`) || '0');
    if(otpReqCount>=2)
    {
        await redis.set(`otp-spam-lock:${email}`,"locked","EX",3600);
        return next(new BadRequestError("Too many requests! Please try again after 1hour"));
    }
    await redis.set(`otp-req-count:${email}`, otpReqCount + 1, "EX", 3600);
    return next();
}

export const trackOtpAttempts = async(email:string,otp:Number,next:NextFunction)=>{
    const isLocked = await redis.get(`otp-lock:${email}`);
    if(isLocked == 'locked')
    {
        return next(new BadRequestError("Multiple failed attempts! Please wait for 30 minutes."));
    }

    const otpAttemptCount = parseInt(await redis.get(`otp-attempts:${email}`) || '0');
    const storedOtp = parseInt(await redis.get(`otp:${email}`) || '0');
    if(storedOtp != otp){
        if(otpAttemptCount >= 3){
            await redis.set(`otp-lock:${email}`,"locked","EX",1800);
            return next(new BadRequestError("Multiple failed attempts! please try again after 30minutes."));
        }
        await redis.set(`otp-attempts:${email}`,otpAttemptCount+1,"EX",1800);
        return next(new BadRequestError(`Incorrect OTP! You have ${3-otpAttemptCount} attempts left`));
    }
    await redis.del(`otp:${email}`);
    await redis.del(`otp-attempts:${email}`);
    await redis.del(`otp-cooldown:${email}`);
    return next();
    
}

export const validateOtp = async(email:string,next:NextFunction)=>{
    if(await redis.get(`otp-spam-lock:${email}`))
    {
        return next(new BadRequestError("Too many otp requeests! Please wait for 1hour to generate new OTP"));
    }
    if(await redis.get(`otp-lock:${email}`))
    {
        return next(new BadRequestError("Multiple failed attempts! Please wait for 30 minutes for requesting new OTP"));
    }
    if(await redis.get(`otp-cooldown:${email}`)){
        return next(new BadRequestError("Please wait for 1min to request for new Otp"));
    }
    return next();
}

export const sendOtp = async(to:string,message:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();
    sendEmail(to,message);
    await redis.set(`otp:${to}`,otp,'EX',300);
    await redis.set(`otp-cooldown:${to}`,'true','EX',60);
}