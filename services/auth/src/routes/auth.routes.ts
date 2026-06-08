import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { validateUserRegister, validateUserLogin } from '../middleware/validate.middleware.js';
import verifyOtp from '../utils/verifyotp.helper.js';

export const authRouter = Router();

authRouter.post('/register', validateUserRegister, registerUser);
authRouter.post('/login', validateUserLogin, loginUser);

authRouter.post('/verify-otp',verifyOtp);