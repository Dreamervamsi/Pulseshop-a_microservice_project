import { BadRequestError, NotFoundError } from '@pulseshop/shared/error-handler';
import { Request, Response } from 'express';
import { RegisterValidationType } from '@pulseshop/shared/types';
import { prisma } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '@pulseshop/shared/error-handler';

export const registerUser = async (req: Request, res: Response) => {
    req.body.name = req.body.name.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    const { name, email, password }: RegisterValidationType = req.body;
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!isUserExists) {
        throw new BadRequestError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        return res.status(201).json({
            status: true,
            message: 'User registered successfully',
            data: user
        });
    }catch(error){
        throw new InternalServerError('Failed to register user');
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const isPasswordCorrect = await bcrypt.compare(hashedPassword, user?.password || '');
    if (!isPasswordCorrect) {
        throw new BadRequestError('Invalid password');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.status(201).json({
        status: true,
        message: 'User Login successfully',
        data: user,
        token:token
    });
}