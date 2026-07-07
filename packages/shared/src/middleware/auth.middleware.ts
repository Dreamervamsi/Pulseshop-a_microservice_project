import { NextFunction, Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../error-handler.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types.js';
import { asyncHandler } from '../asyncHandler.js';

// by default Express 'Request' doesnt have userId, so we set them and use them in jwt verification
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = asyncHandler(async(req:Request,_res:Response,next:NextFunction) =>{
    const header = req.headers.authorization;

    if(!header || !header?.startsWith('Bearer '))
    {
        
        return next(new UnauthorizedError("Not token provided"));
    }
    const token = header.split(' ')[1];

    if(!token)
    {
        return next(new NotFoundError("Access denied! Token not found"));
    }
    const tokenSecret = process.env.JWT_SECRET || undefined;
    if(tokenSecret)
    {
        const decoded = jwt.verify(token,tokenSecret) as JWTPayload;
        
        req.userId = decoded.userId;

        return next();
    }
    else{
        return next(new NotFoundError("Secret Token not found"));
    }
});
