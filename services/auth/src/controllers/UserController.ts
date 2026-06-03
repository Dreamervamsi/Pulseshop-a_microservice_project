import { BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { Request, Response } from 'express';
import { RegisterValidationType } from '@pulseshop/shared/types';
import { prisma } from '../models/UserModel.js';

export const registerUser = async (req: Request, res: Response) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password }: RegisterValidationType = req.body;
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (isUserExists) {
        throw new BadRequestError('User already exists');
    }
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    });
    return res.status(201).json({
        status: true,
        message: 'User registered successfully',
        data: user
    });
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
    return res.status(201).json({
        status: true,
        message: 'User Login successfully',
        data: user
    });
}