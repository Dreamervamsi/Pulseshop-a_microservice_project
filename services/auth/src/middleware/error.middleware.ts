import { NextFunction, Request,Response } from "express";
import { AppError} from "@pulseshop/shared/error-handler";

export const errMiddeware = (err:Error,req:Request,res:Response,next:NextFunction)=>{
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                status: false,
                error: err.constructor.name,
                message: err.message,
                ...(err.description &&{description:err.description}) ,
                isOperational: err.isOperational
            });
        }
        console.log("Error:",err);
        return res.status(500).json({
            status:false,
            error:"InternalServerError",
            message:"Unexpected Error"
        });
}