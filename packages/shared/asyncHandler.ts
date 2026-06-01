import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "./error-handler";

export const asyncHandler = (fn:Function) => (req:Request,res:Response,next:NextFunction) => {
    Promise.resolve(fn(req,res,next)).catch((error:Error) => {
        next(new InternalServerError(error.message,error.description));
    });
}