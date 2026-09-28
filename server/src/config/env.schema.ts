import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32, 'must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'must be at least 32 characters'),
  // Site origin(s) allowed to call the API from a browser. Comma-separated for several,
  // e.g. "https://shan.dev,http://localhost:5173". Trailing slashes are ignored.
  CLIENT_URL: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim().replace(/\/+$/, ''))
        .filter(Boolean),
    )
    .pipe(z.array(z.string().url()).min(1)),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  IP_HASH_SALT: z.string().min(32, 'must be at least 32 characters'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  // Proxies in front of Express in production. Render alone = 1; Vercel rewrite → Render = 2.
  // Wrong value = every visitor shares one rate-limit bucket (too low) or IPs can be spoofed (too high).
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv | Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return result.data;
}
