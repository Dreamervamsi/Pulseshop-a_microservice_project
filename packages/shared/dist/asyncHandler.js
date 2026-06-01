import { InternalServerError } from "./error-handler.js";
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(new InternalServerError(error.message, error.message));
    });
};
//# sourceMappingURL=asyncHandler.js.map