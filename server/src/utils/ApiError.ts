export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    /** Extra machine-readable info, e.g. per-field validation errors. */
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
