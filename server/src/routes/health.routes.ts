import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

export const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: { status: 'ok', uptime: process.uptime() },
    });
  }),
);
