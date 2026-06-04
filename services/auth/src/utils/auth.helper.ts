import { prisma } from "../models/user.model";
import { BadRequestError } from "@pulseshop/shared/error-handler";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from "@pulseshop/shared/index";
import { sendEmail } from "./sendEmail";

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

export const sendOtp = async(to:string,message:string,email:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();
    sendEmail(to,message);
    await redis.set(`otp:${email}`,otp,'EX',300);
    await redis.set(`otp_cooldown:${email}`,'true','EX',60);
}