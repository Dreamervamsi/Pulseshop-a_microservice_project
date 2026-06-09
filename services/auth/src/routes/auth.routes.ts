import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
// import { validateUserRegister, validateUserLogin } from '../middleware/error.middleware.js';
import verifyOtp from '../utils/verifyotp.helper.js';
import {asyncHandler} from '@pulseshop/shared/asyncHandler';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(registerUser));
authRouter.post('/login', asyncHandler(loginUser));

authRouter.post('/verify-otp',verifyOtp);