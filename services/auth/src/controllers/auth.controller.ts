import { AppError, BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { Request, Response } from 'express';
import { RegisterValidationType } from '@pulseshop/shared/types';
import { prisma } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkUserExists, createUser} from '../utils/auth.helper.js';
import verifyOtp from '../utils/verifyotp.helper.js';

export const registerUser = async (req: Request, res: Response) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password,otp }: RegisterValidationType = req.body;
    
    try{
        // check user exists
        await checkUserExists(email);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        // create user
        const {user,token} = await createUser(name,email,hashedPassword);
        
        await verifyOtp(email,otp);

        return res.status(201).json({
            status: true,
            message: 'User registered successfully',
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
    const { email, password,otp } = req.body;
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

    await verifyOtp(email,otp);

    return res.status(201).json({
        status: true,
        message: 'User Login successfully',
        data: user,
        token:token
    });
}