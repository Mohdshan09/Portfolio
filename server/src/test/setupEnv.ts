const defaults: Record<string, string> = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  CLIENT_URL: 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: 'test',
  CLOUDINARY_API_KEY: 'test',
  CLOUDINARY_API_SECRET: 'test',
  IP_HASH_SALT: 'c'.repeat(32),
  ADMIN_EMAIL: 'admin@example.com',
  // bcrypt (cost 4, tests only) of 'test-password'
  ADMIN_PASSWORD_HASH: '$2a$04$pauyH8jbkJtQSRSCmTGiU.oygRmW05grritZr1jniCR1nt9Uay/oS',
  NODE_ENV: 'test',
  PORT: '4000',
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
