import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Parses `req.body` with a Zod schema and replaces it with the parsed output.
 * Invalid input → 400 `{ code: 'VALIDATION_ERROR', fields: { name: 'at least 2 characters' } }`.
 */
export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_';
        fields[key] ??= issue.message;
      }
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', { fields }));
      return;
    }
    req.body = result.data;
    next();
  };
}
