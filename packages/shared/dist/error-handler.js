export class AppError extends Error {
    message;
    statusCode;
    isOperational;
    description;
    constructor(message, statusCode, isOperational = true, description) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.description = description;
        Error.captureStackTrace(this);
    }
}
export class ApiError extends AppError {
    constructor(message, statusCode, description, isOperational = true) {
        super(message, statusCode, isOperational, description);
    }
}
export class InternalServerError extends ApiError {
    constructor(message, description) {
        super(message, 500, description, false);
    }
}
export class NotFoundError extends ApiError {
    constructor(message, description) {
        super(message, 404, description, false);
    }
}
export class BadRequestError extends ApiError {
    constructor(message, description) {
        super(message, 400, description, false);
    }
}
export class UnauthorizedError extends ApiError {
    constructor(message, description) {
        super(message, 401, description, false);
    }
}
export class ForbiddenError extends ApiError {
    constructor(message, description) {
        super(message, 403, description, false);
    }
}
//# sourceMappingURL=error-handler.js.map