import { AppError, BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { Request, Response } from 'express';
import { RegisterValidationType } from '@pulseshop/shared/types';
import { prisma } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkUserExists, createUser, sendOtp} from '../utils/auth.helper.js';
import verifyOtp from '../utils/verifyotp.helper.js';

export const registerUser = async (req: Request, res: Response) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password }: RegisterValidationType = req.body;
    
    try{
        // check user exists
        await checkUserExists(email);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        // create user
        const {user,token} = await createUser(name,email,hashedPassword);
        
        await sendOtp(email,"Verify OTP");

        return res.status(201).json({
            status: true,
            message: 'OTP send to your email! Please verify otp',
            data: user,
            token:token
        });

    }catch(error:any){
        if(error instanceof AppError)
        {
            return res.status(error.statusCode).json({
                status:'failed',
                message:error.message,
                description:error.description
            });
        }
        return res.status(500).json({
            status:'failed',
            message:'InternalServerError',
            error:error.message
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    req.body.email = req.body.email.toLowerCase();
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
    if (!isPasswordCorrect) {
        throw new BadRequestError('Invalid password');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    await sendOtp(email,"Verify OTP");

    return res.status(201).json({
        status: true,
        message: 'OTP send to your email! please verify it',
        data: user,
        token:token
    });
}

export const verifyOtpRequest = async (req: Request, res: Response) =>{
    const {email,otp} : {email:string,otp:string} = req.body;
    
    try{
        await verifyOtp(email,otp);

        return res.status(200).json({
            status:'success',
            description:"Otp verified successfully"
        });

    }catch(error:any)
    {
        if(error instanceof AppError)
        {
            return res.status(error.statusCode).json({
                status:'failed',
                message:error.message,
                error:error.description
            });
        }
        return res.status(500).json({
            status:'failed',
            error:error.message,
            description:"Internal Server error"
        });
    }
}