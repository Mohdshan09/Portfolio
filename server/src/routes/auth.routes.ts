import { Router } from 'express';
import { loginSchema } from '@portfolio/shared';
import { loginLimiter, sessionLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { login, logout, refresh } from '../controllers/auth.controller';

// No register route — single admin, credentials live in env.
export const authRouter = Router();

authRouter.post('/login', loginLimiter, validateBody(loginSchema), asyncHandler(login));
authRouter.post('/refresh', sessionLimiter, asyncHandler(refresh));
authRouter.post('/logout', sessionLimiter, asyncHandler(logout));
