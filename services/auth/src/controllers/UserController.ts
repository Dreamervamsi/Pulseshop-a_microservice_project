import { BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { RegisterValidationType } from '@pulseshop/shared/types';

export const registerUser = async (req: Request, res: Response) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password }: RegisterValidationType = req.body;
    // const isUserExists = await User.findOne({email});
    // if(isUserExists){
    //     throw new BadRequestError('User already exists');
    // }
    // const user = await User.create({name,email,password});
    return res.status(201).json({
        status: true,
        message: 'User registered successfully',
        // data:user
    });
}

export const loginUser = async (req: Request, res: Response) => {
    req.body.email = req.body.email.toLowerCase();
    const { email, password }: { name: string, email: string, password: string } = req.body;
    // const user = await User.findOne({email});
    // if(!user){
    //     throw new NotFoundError('User not found');
    // }
    return res.status(201).json({
        status: true,
        message: 'User Login successfully',
        // data:user
    });
}