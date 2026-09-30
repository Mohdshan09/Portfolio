import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { healthRouter } from './routes/health.routes';
import { contactRouter } from './routes/contact.routes';
import { trackRouter } from './routes/track.routes';
import { authRouter } from './routes/auth.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestContext } from './middleware/requestContext';
import { ApiError } from './utils/ApiError';

export const app = express();

// Without this every visitor shares the proxy's IP and rate limits become global.
if (env.NODE_ENV === 'production') app.set('trust proxy', env.TRUST_PROXY_HOPS);

app.use(helmet());
app.use(requestContext);
app.use(
  cors({
    // Only our own site may call the API from a browser. Requests without an Origin header
    // (curl, health checks, Vercel's server-side rewrite) aren't browser CORS and pass through.
    origin: env.CLIENT_URL,
    credentials: true, // allow the httpOnly refresh cookie on /api/auth/*
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600, // cache preflight responses for 10 minutes
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.use('/api/health', healthRouter);
app.use('/api/contact', contactRouter);
app.use('/api/track', trackRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'NOT_FOUND', 'Resource not found'));
});

app.use(errorHandler);
