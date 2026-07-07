export class AppError extends Error {
    public readonly message:string;
    public readonly statusCode:number;
    public readonly isOperational:boolean;
    public readonly description?:string;

    constructor(message:string,statusCode:number,isOperational:boolean=true,description?:string){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.description = description;
        Error.captureStackTrace(this);
    }
}

export class ApiError extends AppError {
    constructor(message:string,statusCode:number,description?:string,isOperational:boolean=true){
        super(message,statusCode,isOperational,description);
    }
}
export class InternalServerError extends ApiError {
    constructor(message:string,description?:string){
        super(message,500,description,false);
    }
}

export class NotFoundError extends ApiError {
    constructor(message:string,description?:string){
        super(message,404,description,false);
    }
}
export class BadRequestError extends ApiError {
    constructor(message:string,description?:string){
        super(message,400,description,false);
    }
}
export class UnauthorizedError extends ApiError {
    constructor(message:string,description?:string){
        super(message,401,description,false);
    }
}
export class ForbiddenError extends ApiError {
    constructor(message:string,description?:string){
        super(message,403,description,false);
    }
}