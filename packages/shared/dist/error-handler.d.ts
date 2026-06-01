export declare class AppError extends Error {
    readonly message: string;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly description?: string;
    constructor(message: string, statusCode: number, isOperational?: boolean, description?: string);
}
export declare class ApiError extends AppError {
    constructor(message: string, statusCode: number, description?: string, isOperational?: boolean);
}
export declare class InternalServerError extends ApiError {
    constructor(message: string, description?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message: string, description?: string);
}
export declare class BadRequestError extends ApiError {
    constructor(message: string, description?: string);
}
export declare class UnauthorizedError extends ApiError {
    constructor(message: string, description?: string);
}
export declare class ForbiddenError extends ApiError {
    constructor(message: string, description?: string);
}
