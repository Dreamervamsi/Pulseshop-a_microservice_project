import { BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { NextFunction, Request, Response } from 'express';
import { RegisterValidationType } from '@pulseshop/shared/types';
import { prisma } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '@pulseshop/shared/error-handler';
import { checkUserExists, createUser, validateOtp} from '../utils/auth.helper.js';
import verifyOtp from '../utils/verifyotp.helper.js';

export const registerUser = async (req: Request, res: Response,next:NextFunction) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password }: RegisterValidationType = req.body;
    
    // check user exists
    await checkUserExists(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        // create user
        const {user,token} = await createUser(name,email,hashedPassword);
        
        // otp verification    
        verifyOtp(req,res,next);
        
        return res.status(201).json({
            status: true,
            message: 'User registered successfully',
            data: user,
            token:token
        });

    }catch(error){
        throw new InternalServerError('Failed to register user');
    }
}

export const loginUser = async (req: Request, res: Response,next:NextFunction) => {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const isPasswordCorrect = await bcrypt.compare(hashedPassword, user?.password || '');
    if (!isPasswordCorrect) {
        throw new BadRequestError('Invalid password');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // otp verification
    verifyOtp(req,res,next);

    return res.status(201).json({
        status: true,
        message: 'User Login successfully',
        data: user,
        token:token
    });
}