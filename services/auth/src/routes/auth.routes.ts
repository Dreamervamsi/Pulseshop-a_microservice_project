import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { validateUserRegister, validateUserLogin } from '../middleware/validate.middleware.js';

export const authRouter = Router();

authRouter.post('/register', validateUserRegister, registerUser);
authRouter.post('/login', validateUserLogin, loginUser);