import { type Request, type Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUserRegister = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim(),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: errors.array()[0].msg,
                data: null
            });

        }
        return next();
    }
]

export const validateUserLogin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (req:Request,res:Response,next:NextFunction) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: errors.array()[0].msg,
                data: null
            });
        }
        return next();
    }
]