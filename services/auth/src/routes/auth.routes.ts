import { Router } from 'express';
import { registerUser, loginUser, verifyOtpRequest } from '../controllers/auth.controller.js';
import { validateUserRegister, validateUserLogin } from '@pulseshop/shared/validate-middleware';
// import verifyOtp from '../utils/verifyotp.helper.js';
import {asyncHandler} from '@pulseshop/shared/asyncHandler';
verifyOtpRequest

export const authRouter = Router();

authRouter.post('/register', validateUserRegister, asyncHandler(registerUser));
authRouter.post('/login', validateUserLogin, asyncHandler(loginUser));

authRouter.post('/verify-otp',verifyOtpRequest);