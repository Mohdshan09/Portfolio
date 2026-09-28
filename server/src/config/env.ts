import 'dotenv/config';
import { parseEnv, type Env } from './env.schema';

function loadEnv(): Env {
  try {
    return parseEnv(process.env);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return process.exit(1);
  }
}

export const env = loadEnv();
